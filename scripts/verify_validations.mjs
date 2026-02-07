import fs from 'fs';

const BASE_URL = 'http://localhost:3000/api';

async function request(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };
        if (body) options.body = JSON.stringify(body);

        console.log(`Fetching ${endpoint}...`);
        const res = await fetch(`${BASE_URL}${endpoint}`, options);
        console.log(`Response status: ${res.status}`);
        const data = await res.json().catch(() => ({}));
        return { status: res.status, data };
    } catch (e) {
        console.error('Fetch error:', e);
        return { status: 500, data: { message: e.message } };
    }
}

async function run() {
    console.log('--- STARTING VERIFICATION ---');

    // 1. Register User
    const email = `test_${Date.now()}@example.com`;
    console.log(`\n1. Registering User (${email})...`);
    const regRes = await request('/auth/register', 'POST', {
        first_name: 'Test',
        last_name: 'User',
        email,
        password: 'password123',
        date_of_birth: '1990-01-01'
    });

    if (regRes.status !== 200) {
        console.error('Failed to register:', regRes.data);
        return;
    }
    const userId = regRes.data.user._id;
    console.log('User registered:', userId);

    // 2. Get Tree
    console.log('\n2. Fetching Family Tree...');
    const treeRes = await request(`/trees?userId=${userId}`);
    if (treeRes.status !== 200 || treeRes.data.length === 0) {
        console.error('Failed to get tree:', treeRes.data);
        return;
    }
    const treeId = treeRes.data[0]._id;
    console.log('Tree found:', treeId);

    // 3. Create Root Member (Parent)
    console.log('\n3. Creating Root Parent...');
    const parentRes = await request('/members', 'POST', {
        tree_id: treeId,
        first_name: 'Root',
        last_name: 'Parent',
        gender: 'male',
        birth_date: '1980-01-01', // 46 years old
        is_root: true
    });
    const parentId = parentRes.data._id;
    console.log('Parent created:', parentId);

    // 4. Test Sibling Gap
    console.log('\n--- TESTING SIBLING GAP ---');
    // Child 1
    const child1Res = await request('/members', 'POST', {
        tree_id: treeId,
        first_name: 'Child',
        last_name: 'One',
        gender: 'female',
        birth_date: '2000-01-01'
    });
    const child1Id = child1Res.data._id;

    // Link Child 1
    await request('/relationships', 'POST', {
        tree_id: treeId,
        person1_id: parentId,
        person2_id: child1Id,
        relationship_type: 'parent_child'
    });
    console.log('Child 1 linked (2000-01-01).');

    // Child 2 (Too close - 1 month later)
    const child2Res = await request('/members', 'POST', {
        tree_id: treeId,
        first_name: 'Child',
        last_name: 'Two',
        birth_date: '2000-02-01'
    });
    const child2Id = child2Res.data._id;

    console.log('Linking Child 2 (2000-02-01, 1 month gap)... expecting failure.');
    const failSiblingRes = await request('/relationships', 'POST', {
        tree_id: treeId,
        person1_id: parentId,
        person2_id: child2Id,
        relationship_type: 'parent_child'
    });

    if (failSiblingRes.status === 400 && failSiblingRes.data.message.includes('Sibling')) {
        console.log('✅ SUCCESS: Sibling gap validation failed as expected.');
        console.log('Message:', failSiblingRes.data.message);
    } else {
        console.error('❌ FAILURE: Should have failed sibling gap.', failSiblingRes.data);
    }

    // 5. Test Parent Age
    console.log('\n--- TESTING PARENT AGE ---');
    // Young Parent
    const youngParentRes = await request('/members', 'POST', {
        tree_id: treeId,
        first_name: 'Young',
        last_name: 'Parent',
        birth_date: '2010-01-01'
    });
    const youngParentId = youngParentRes.data._id;

    // Child for young parent (Born 2012, Parent is 2)
    const babyRes = await request('/members', 'POST', {
        tree_id: treeId,
        first_name: 'Baby',
        last_name: 'Boo',
        birth_date: '2012-01-01'
    });
    const babyId = babyRes.data._id;

    console.log('Linking baby to young parent (age 2)... expecting failure.');
    const failParentAgeRes = await request('/relationships', 'POST', {
        tree_id: treeId,
        person1_id: youngParentId,
        person2_id: babyId,
        relationship_type: 'parent_child'
    });

    if (failParentAgeRes.status === 400 && failParentAgeRes.data.message.includes('Parent is too young')) {
        console.log('✅ SUCCESS: Parent age validation failed as expected.');
        console.log('Message:', failParentAgeRes.data.message);
    } else {
        console.error('❌ FAILURE: Should have failed parent age.', failParentAgeRes.data);
    }

    // 6. Test Marriage Age
    console.log('\n--- TESTING MARRIAGE AGE ---');
    // Young Spouse
    const youngSpouseRes = await request('/members', 'POST', {
        tree_id: treeId,
        first_name: 'Young',
        last_name: 'Spouse',
        birth_date: '2015-01-01' // 11 years old today
    });
    const youngSpouseId = youngSpouseRes.data._id;

    console.log('Marrying Root Parent (46) to Young Spouse (11)... expecting failure.');
    const failMarriageRes = await request('/relationships', 'POST', {
        tree_id: treeId,
        person1_id: parentId,
        person2_id: youngSpouseId,
        relationship_type: 'spouse'
    });

    if (failMarriageRes.status === 400 && failMarriageRes.data.message.includes('too young')) {
        console.log('✅ SUCCESS: Marriage age validation failed as expected.');
        console.log('Message:', failMarriageRes.data.message);
    } else {
        console.error('❌ FAILURE: Should have failed marriage age.', failMarriageRes.data);
    }

    // 7. Test Member Update (PUT)
    console.log('\n--- TESTING MEMBER UPDATE ---');
    // Create valid child first (2002)
    const child3Res = await request('/members', 'POST', {
        tree_id: treeId,
        first_name: 'Child',
        last_name: 'Three',
        birth_date: '2002-01-01'
    });
    const child3Id = child3Res.data._id;
    await request('/relationships', 'POST', {
        tree_id: treeId,
        person1_id: parentId,
        person2_id: child3Id,
        relationship_type: 'parent_child'
    });
    console.log('Child 3 created and linked (2002).');

    // Valid Update
    console.log('Updating Child 3 DOB to 2003 (valid gap)...');
    const validUpdateRes = await request(`/members/${child3Id}`, 'PUT', {
        memberId: child3Id,
        tree_id: treeId,
        birth_date: '2003-01-01'
    });
    if (validUpdateRes.status === 200) {
        console.log('✅ SUCCESS: Valid update passed.');
    } else {
        console.error('❌ FAILURE: Valid update failed.', validUpdateRes.data);
    }

    // Invalid Update (Too close to Child 1: 2000-01-01)
    console.log('Updating Child 3 DOB to 2000-02-01 (invalid gap)...');
    const invalidUpdateRes = await request(`/members/${child3Id}`, 'PUT', {
        memberId: child3Id,
        tree_id: treeId,
        birth_date: '2000-02-01'
    });

    if (invalidUpdateRes.status === 400 && invalidUpdateRes.data.message.includes('Sibling')) {
        console.log('✅ SUCCESS: Invalid update failed as expected.');
        console.log('Message:', invalidUpdateRes.data.message);
    } else {
        console.error('❌ FAILURE: Should have failed invalid update.', invalidUpdateRes.data);
    }

    console.log('\n--- VERIFICATION COMPLETE ---');
}

run();
