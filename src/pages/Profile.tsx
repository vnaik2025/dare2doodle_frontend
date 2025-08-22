import { useQuery } from '@tanstack/react-query';
import {
  getProfile,
  getSubmissions,
  getLikedPosts,
  getCommentedPosts,
 
} from '../apis/usersApi';
import type{ User,
  Comment,
} from '../apis/usersApi';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import CommentComponent from '../components/features/Comment';
import Card from '../components/common/Card';

const Profile = () => {
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery<User>({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const {
    data: submissions,
    isLoading: submissionsLoading,
    error: submissionsError,
  } = useQuery<Comment[]>({
    queryKey: ['submissions'],
    queryFn: getSubmissions,
  });

  const {
    data: likedPosts,
    isLoading: likedLoading,
    error: likedError,
  } = useQuery<Comment[]>({
    queryKey: ['likedPosts'],
    queryFn: getLikedPosts,
  });

  const {
    data: commentedPosts,
    isLoading: commentedLoading,
    error: commentedError,
  } = useQuery<Comment[]>({
    queryKey: ['commentedPosts'],
    queryFn: getCommentedPosts,
  });

  if (profileLoading || submissionsLoading || likedLoading || commentedLoading) {
    return <Loader />;
  }

  if (profileError || submissionsError || likedError || commentedError) {
    return <ErrorMessage message="Failed to load profile data" />;
  }

  return (
    <div>
      <Card>
        <h2 className="text-2xl font-bold">{profile?.username}</h2>
        <p className="text-gray-600">{profile?.email}</p>
      </Card>

      <h3 className="text-xl font-semibold mt-8 mb-4">Your Submissions</h3>
      {submissions && submissions.length > 0 ? (
        submissions.map((submission) => (
          <CommentComponent key={submission.id} comment={submission} />
        ))
      ) : (
        <p className="text-gray-500">No submissions yet.</p>
      )}

      <h3 className="text-xl font-semibold mt-8 mb-4">Liked Posts</h3>
      {likedPosts && likedPosts.length > 0 ? (
        likedPosts.map((post) => (
          <CommentComponent key={post.id} comment={post} />
        ))
      ) : (
        <p className="text-gray-500">No liked posts yet.</p>
      )}

      <h3 className="text-xl font-semibold mt-8 mb-4">Commented Posts</h3>
      {commentedPosts && commentedPosts.length > 0 ? (
        commentedPosts.map((post) => (
          <CommentComponent key={post.id} comment={post} />
        ))
      ) : (
        <p className="text-gray-500">No commented posts yet.</p>
      )}
    </div>
  );
};

export default Profile;
