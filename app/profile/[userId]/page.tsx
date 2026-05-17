import { ProfileContent } from "@/components/profile/ProfileContent";

type ProfileByIdPageProps = {
  params: Promise<{ userId: string }>;
};

export default async function ProfileByIdPage({ params }: ProfileByIdPageProps) {
  const { userId } = await params;
  return <ProfileContent userId={userId} />;
}
