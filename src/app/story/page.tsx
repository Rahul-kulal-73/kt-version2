'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
    BookOpen,
    ArrowLeft,
    Loader2,
    Sparkles,
    AlertCircle,
    Download
} from 'lucide-react';
import Link from 'next/link';

export default function StoryPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [story, setStory] = useState<string | null>(null);
    const [profileComplete, setProfileComplete] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        checkProfile();
    }, [user]);

    const checkProfile = async () => {
        try {
            const response = await fetch('/api/profile', { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                setProfileComplete(data.user.profile_completed || false);
                if (data.user.generated_story) {
                    setStory(data.user.generated_story);
                }
            } else if (response.status === 401) {
                toast.error('Session expired. Please log in again.');
                router.push('/login');
            }
        } catch (error) {
            console.error('Failed to check profile:', error);
        }
    };

    const generateStory = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/story/generate', {
                method: 'POST',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.requiresProfile) {
                    toast.error('Please complete your profile first');
                    router.push('/profile');
                    return;
                }
                throw new Error(data.error || 'Failed to generate story');
            }

            setStory(data.story);
            toast.success('Your life story has been generated!');
        } catch (error: any) {
            console.error('Failed to generate story:', error);
            toast.error(error.message || 'Failed to generate story');
        } finally {
            setLoading(false);
        }
    };

    const downloadStory = () => {
        if (!story) return;

        const element = document.createElement('a');
        const file = new Blob([story], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${user?.first_name}_life_story.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast.success('Story downloaded!');
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F5F2E9' }}>
            <header className="bg-white border-b sticky top-0 z-40" style={{ borderColor: '#d4c5cb' }}>
                <div className="container mx-auto px-3 sm:px-4 py-3">
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-auto sm:w-auto p-0 sm:px-3">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline ml-2">Back</span>
                            </Button>
                        </Link>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-base sm:text-xl font-bold truncate" style={{ color: '#64303A' }}>
                                Your Life Story
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">
                                AI-generated narrative from your profile
                            </p>
                        </div>
                        {story && (
                            <Button
                                onClick={downloadStory}
                                variant="outline"
                                size="sm"
                                className="text-xs sm:text-sm h-8 sm:h-auto px-2 sm:px-4"
                            >
                                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline ml-1 sm:ml-2">Download</span>
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
                {!profileComplete ? (
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-yellow-800">
                                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                                Profile Incomplete
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm text-yellow-700">
                                Complete your profile to generate your life story
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                            <p className="text-xs sm:text-sm text-yellow-800 mb-4">
                                To generate your life story, we need some basic information about you:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-yellow-700 mb-4">
                                <li>Date of birth</li>
                                <li>Place of birth</li>
                                <li>Current location</li>
                                <li>Education, work history, and life events (optional but recommended)</li>
                            </ul>
                            <Link href="/profile">
                                <Button style={{ backgroundColor: '#64303A', color: 'white' }} size="sm" className="text-xs sm:text-sm">
                                    Complete Profile
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : !story ? (
                    <Card>
                        <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#64303A' }} />
                                Generate Your Life Story
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Create a narrative story from your profile information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                            <div className="space-y-3 sm:space-y-4">
                                <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">How it works:</h3>
                                    <ul className="list-disc list-inside space-y-1 text-blue-800 text-xs sm:text-sm">
                                        <li>Uses AI to create a readable narrative from your profile</li>
                                        <li>Based strictly on information you provided</li>
                                        <li>No invented facts or assumptions</li>
                                        <li>Respectful and emotionally neutral tone</li>
                                        <li>Can be downloaded and shared</li>
                                    </ul>
                                </div>

                                <div className="p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-amber-900 text-xs sm:text-sm font-medium">
                                        ⚠️ Important: This story will be generated from information provided by you.
                                        AI will not add any speculative or fictional elements.
                                    </p>
                                </div>

                                <Button
                                    onClick={generateStory}
                                    disabled={loading}
                                    className="w-full text-xs sm:text-sm h-9 sm:h-10"
                                    style={{ backgroundColor: '#64303A', color: 'white' }}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            <span className="hidden sm:inline">Generate My Life Story</span>
                                            <span className="sm:hidden">Generate Story</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#64303A' }} />
                                Your Life Story
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Generated from your profile information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                            <div className="space-y-3 sm:space-y-4">
                                <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-blue-900 text-xs sm:text-sm">
                                        ℹ️ This story is generated from information provided by your family.
                                    </p>
                                </div>

                                <div className="prose prose-sm sm:prose-lg max-w-none">
                                    <div
                                        className="whitespace-pre-wrap text-gray-800 leading-relaxed text-xs sm:text-base"
                                        style={{ fontFamily: 'Georgia, serif' }}
                                    >
                                        {story}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                                    <Button
                                        onClick={generateStory}
                                        disabled={loading}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs sm:text-sm w-full sm:w-auto"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                                                <span className="hidden sm:inline">Regenerating...</span>
                                                <span className="sm:hidden">Regenerate</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                                Regenerate
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={downloadStory}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs sm:text-sm w-full sm:w-auto"
                                    >
                                        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
