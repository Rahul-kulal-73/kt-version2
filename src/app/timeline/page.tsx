'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
    MapPin,
    ArrowLeft,
    AlertCircle,
    Calendar,
    GraduationCap,
    Briefcase,
    Heart,
    Plane
} from 'lucide-react';
import Link from 'next/link';

interface TimelineEvent {
    year: number;
    type: 'birth' | 'education' | 'work' | 'life_event' | 'location';
    title: string;
    description?: string;
    location?: string;
    icon: any;
    color: string;
}

export default function TimelinePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profileComplete, setProfileComplete] = useState(false);
    const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
    const [locations, setLocations] = useState<any[]>([]);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        loadTimelineData();
    }, [user]);

    const loadTimelineData = async () => {
        try {
            const response = await fetch('/api/profile');
            if (response.ok) {
                const data = await response.json();
                const profile = data.user;

                setProfileComplete(profile.profile_completed || false);

                if (profile.profile_completed) {
                    buildTimeline(profile);
                    setLocations(profile.location_history || []);
                }
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
            toast.error('Failed to load timeline data');
        } finally {
            setLoading(false);
        }
    };

    const buildTimeline = (profile: any) => {
        const events: TimelineEvent[] = [];

        if (profile.date_of_birth) {
            const birthYear = new Date(profile.date_of_birth).getFullYear();
            events.push({
                year: birthYear,
                type: 'birth',
                title: 'Born',
                description: profile.place_of_birth,
                location: [profile.birth_city, profile.birth_state, profile.birth_country].filter(Boolean).join(', '),
                icon: Heart,
                color: '#64303A'
            });
        }

        if (profile.education) {
            profile.education.forEach((edu: any) => {
                if (edu.year && edu.degree) {
                    events.push({
                        year: edu.year,
                        type: 'education',
                        title: edu.degree,
                        description: edu.institution,
                        location: edu.location,
                        icon: GraduationCap,
                        color: '#2563eb'
                    });
                }
            });
        }

        if (profile.work_history) {
            profile.work_history.forEach((work: any) => {
                if (work.start_year && work.position) {
                    events.push({
                        year: work.start_year,
                        type: 'work',
                        title: work.position,
                        description: work.company,
                        location: work.location,
                        icon: Briefcase,
                        color: '#059669'
                    });
                }
            });
        }

        if (profile.life_events) {
            profile.life_events.forEach((event: any) => {
                if (event.year && event.title) {
                    events.push({
                        year: event.year,
                        type: 'life_event',
                        title: event.title,
                        description: event.description,
                        location: event.location,
                        icon: Heart,
                        color: '#dc2626'
                    });
                }
            });
        }

        if (profile.location_history) {
            profile.location_history.forEach((loc: any) => {
                if (loc.year && loc.location) {
                    events.push({
                        year: loc.year,
                        type: 'location',
                        title: `Moved to ${loc.location}`,
                        description: loc.description,
                        location: [loc.city, loc.state, loc.country].filter(Boolean).join(', '),
                        icon: Plane,
                        color: '#7c3aed'
                    });
                }
            });
        }

        events.sort((a, b) => a.year - b.year);
        setTimeline(events);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F2E9' }}>
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#64303A] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading timeline...</p>
                </div>
            </div>
        );
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
                                Your Timeline & Map
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">
                                Visual journey of your life
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
                {!profileComplete ? (
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-yellow-800">
                                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                                Profile Incomplete
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm text-yellow-700">
                                Complete your profile to view your timeline and map
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                            <p className="text-xs sm:text-sm text-yellow-800 mb-4">
                                To generate your timeline and map, we need some basic information about you:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-yellow-700 mb-4">
                                <li>Date of birth and place of birth</li>
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
                ) : (
                    <div className="space-y-6 sm:space-y-8">
                        <Card>
                            <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#64303A' }} />
                                    Your Life Timeline
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    Chronological journey of your life events
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                                {timeline.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                        <p className="text-sm sm:text-base text-gray-600 mb-4">
                                            No timeline events found. Add more information to your profile to see your life timeline.
                                        </p>
                                        <Link href="/profile">
                                            <Button variant="outline" size="sm" className="text-xs sm:text-sm">Update Profile</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

                                        <div className="space-y-6 sm:space-y-8">
                                            {timeline.map((event, index) => {
                                                const Icon = event.icon;
                                                return (
                                                    <div key={index} className="relative flex gap-3 sm:gap-6">
                                                        <div
                                                            className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center z-10"
                                                            style={{ backgroundColor: event.color }}
                                                        >
                                                            <Icon className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                                                        </div>

                                                        <div className="flex-1 pb-4 sm:pb-8">
                                                            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
                                                                <div className="flex items-start justify-between mb-2 gap-2">
                                                                    <div className="flex-1 min-w-0">
                                                                        <h3 className="font-semibold text-sm sm:text-lg wrap-break-word">{event.title}</h3>
                                                                        {event.description && (
                                                                            <p className="text-xs sm:text-sm text-gray-600 wrap-break-word">{event.description}</p>
                                                                        )}
                                                                    </div>
                                                                    <span
                                                                        className="text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full shrink-0"
                                                                        style={{
                                                                            backgroundColor: `${event.color}20`,
                                                                            color: event.color
                                                                        }}
                                                                    >
                                                                        {event.year}
                                                                    </span>
                                                                </div>
                                                                {event.location && (
                                                                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 mt-2 wrap-break-word">
                                                                        <MapPin className="h-3 w-3 shrink-0" />
                                                                        {event.location}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#64303A' }} />
                                    Location History
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    Places you&apos;ve lived and traveled
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                                {locations.length === 0 ? (
                                    <div className="text-center py-8">
                                        <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                        <p className="text-sm sm:text-base text-gray-600 mb-4">
                                            No locations found. Add location history to your profile to see them mapped here.
                                        </p>
                                        <Link href="/profile">
                                            <Button variant="outline" size="sm" className="text-xs sm:text-sm">Add Locations</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            {locations.map((loc, index) => (
                                                <div key={index} className="p-3 sm:p-4 border rounded-lg bg-white">
                                                    <div className="flex items-start gap-2 sm:gap-3">
                                                        <div
                                                            className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                                                            style={{ backgroundColor: '#64303A' }}
                                                        >
                                                            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-sm sm:text-base wrap-break-word">{loc.location}</h4>
                                                            <p className="text-xs sm:text-sm text-gray-600 wrap-break-word">
                                                                {[loc.city, loc.state, loc.country].filter(Boolean).join(', ')}
                                                            </p>
                                                            {loc.description && (
                                                                <p className="text-xs text-gray-500 mt-1 wrap-break-word">{loc.description}</p>
                                                            )}
                                                            <span
                                                                className="inline-block text-xs font-semibold mt-2 px-2 py-1 rounded"
                                                                style={{
                                                                    backgroundColor: '#64303A20',
                                                                    color: '#64303A'
                                                                }}
                                                            >
                                                                {loc.year}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <p className="text-blue-900 text-xs sm:text-sm wrap-break-word">
                                                🗺️ <strong>Coming soon:</strong> Interactive Google Maps visualization showing your journey across cities and countries.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
