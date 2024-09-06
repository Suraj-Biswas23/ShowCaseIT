import { getUserProjects } from '@/lib/actions'
import ProfilePage from '@/components/ProfilePage'
import type { UserProfile as UserProfileType } from '@/common.types'; // Use type-only import

type Props = {
    params: {
        id: string,
    },
}

const UserProfile = async ({ params }: Props) => {
    const result = await getUserProjects(params.id, 100) as { user: UserProfileType }

    if (!result?.user) return (
        <p className="no-result-text">Failed to fetch user info</p>
    )

    return <ProfilePage user={result?.user}  />
}

export default UserProfile
