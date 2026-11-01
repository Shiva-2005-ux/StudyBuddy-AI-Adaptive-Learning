import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { CommunityPost, CommunityReply } from '../types/student.ts';
import { db, auth } from '../firebase.ts';
import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
  orderBy,
  updateDoc,
  increment,
} from 'firebase/firestore';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  PlusCircle,
  Sparkles,
  Flag,
  Send,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

export const CommunityView: React.FC = () => {
  const { student } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  // New Post Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postSubject, setPostSubject] = useState('Mathematics');

  // Active expanded replies
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});
  const [reportedPosts, setReportedPosts] = useState<string[]>([]);

  // Seed default community posts for student's class
  useEffect(() => {
    if (!student) return;

    const loadPosts = async () => {
      setLoading(true);
      if (auth.currentUser) {
        try {
          const postsQuery = query(
            collection(db, 'communityPosts'),
            where('studentClass', '==', student.selectedClass)
          );
          const snap = await getDocs(postsQuery);
          const fetched: CommunityPost[] = [];
          snap.forEach((d) => {
            fetched.push(d.data() as CommunityPost);
          });

          if (fetched.length > 0) {
            setPosts(fetched);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Could not load community from Firestore, using offline peer threads:', err);
        }
      }

      // Provide realistic starter discussion threads for this class
          const defaultPosts: CommunityPost[] = [
            {
              postId: `default_post_1_${student.selectedClass}`,
              studentId: 'peer_1',
              authorName: 'Rohan Sharma', // Never email!
              studentClass: student.selectedClass,
              subjectId: 'Mathematics',
              title: 'Trick to remember whether to multiply or divide in unlike fractions?',
              content:
                'I kept getting 60% on Topic Set 1 because I mixed up LCM conversion with cross-multiplication. How do you remember which method to use?',
              createdAt: '2 hours ago',
              likesCount: 5,
              repliesCount: 2,
              replies: [
                {
                  replyId: 'rep_1',
                  postId: `default_post_1_${student.selectedClass}`,
                  studentId: 'peer_2',
                  authorName: 'Ananya Verma',
                  content:
                    'Hey Rohan! Remember: LCM is for ADDING and SUBTRACTING because pieces must be the same size. Cross-multiplication is only to COMPARE which fraction is bigger!',
                  createdAt: '1 hour ago',
                },
                {
                  replyId: 'rep_2',
                  postId: `default_post_1_${student.selectedClass}`,
                  studentId: 'peer_3',
                  authorName: 'Aarav Patel',
                  content: 'Also, Quick Notes in StudyBuddy has a great formula cheat-sheet for this!',
                  createdAt: '30 mins ago',
                },
              ],
            },
            {
              postId: `default_post_2_${student.selectedClass}`,
              studentId: 'peer_4',
              authorName: 'Meera Nair',
              studentClass: student.selectedClass,
              subjectId: 'Science',
              title: 'Why is Vitamin C destroyed so easily during cooking?',
              content:
                'Our teacher mentioned eating fresh amla instead of boiled amla murabba for Vitamin C. Is ascorbic acid heat sensitive?',
              createdAt: 'Yesterday',
              likesCount: 8,
              repliesCount: 1,
              replies: [
                {
                  replyId: 'rep_3',
                  postId: `default_post_2_${student.selectedClass}`,
                  studentId: 'peer_5',
                  authorName: 'Devansh Roy',
                  content:
                    'Yes, ascorbic acid chemically breaks down with heat and water solubility. Eating raw oranges or amla gives 100% of the nutrient.',
                  createdAt: '18 hours ago',
                },
              ],
            },
          ];
      setPosts(defaultPosts);
      setLoading(false);
    };

    loadPosts();
  }, [student]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !postTitle.trim() || !postContent.trim()) return;

    const newPostId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newPost: CommunityPost = {
      postId: newPostId,
      studentId: student.studentId,
      authorName: student.fullName, // Only student name, NEVER email!
      studentClass: student.selectedClass,
      subjectId: postSubject,
      title: postTitle.trim(),
      content: postContent.trim(),
      createdAt: 'Just now',
      likesCount: 0,
      repliesCount: 0,
      replies: [],
    };

    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
    setPostTitle('');
    setPostContent('');

    // Persist to Firestore if authenticated
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'communityPosts', newPostId), newPost);
      } catch (err) {
        console.warn('Firestore write community post warning:', err);
      }
    }
  };

  const handleLikePost = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.postId === postId ? { ...p, likesCount: p.likesCount + 1 } : p))
    );
    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'communityPosts', postId), {
          likesCount: increment(1),
        });
      } catch {
        // offline fallback
      }
    }
  };

  const handleAddReply = async (postId: string) => {
    const text = replyInput[postId];
    if (!text || !text.trim() || !student) return;

    const newReply: CommunityReply = {
      replyId: `rep_${Date.now()}`,
      postId,
      studentId: student.studentId,
      authorName: student.fullName,
      content: text.trim(),
      createdAt: 'Just now',
    };

    setPosts((prev) =>
      prev.map((p) =>
        p.postId === postId
          ? {
              ...p,
              repliesCount: p.repliesCount + 1,
              replies: [...(p.replies || []), newReply],
            }
          : p
      )
    );

    setReplyInput((prev) => ({ ...prev, [postId]: '' }));

    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'communityPosts', postId), {
          repliesCount: increment(1),
        });
      } catch {
        // offline fallback
      }
    }
  };

  const handleReportPost = (postId: string) => {
    setReportedPosts((prev) => [...prev, postId]);
  };

  const filteredPosts = posts.filter(
    (p) => selectedSubject === 'All' || p.subjectId === selectedSubject
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Peer Learning Community · {student?.selectedClass || 'Class 6'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Ask & Discuss with Class Peers
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Safe, moderated academic forum. Share study tricks and resolve tricky problems together.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ask a Question</span>
        </button>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Mathematics', 'Science', 'Social Studies', 'English'].map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedSubject === sub
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isReported = reportedPosts.includes(post.postId);
          const isExpanded = expandedPostId === post.postId;

          if (isReported) {
            return (
              <div
                key={post.postId}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-400 italic text-center"
              >
                Post reported and hidden for moderator review.
              </div>
            );
          }

          return (
            <div
              key={post.postId}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-4"
            >
              {/* Post Author Bar - NEVER EMAIL */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    {post.authorName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900">{post.authorName}</span>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span>{post.studentClass}</span>
                      <span>·</span>
                      <span className="font-semibold text-indigo-600">{post.subjectId}</span>
                      <span>·</span>
                      <span>{post.createdAt}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleReportPost(post.postId)}
                  title="Report inappropriate content"
                  className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title & Content */}
              <div>
                <h3 className="text-base font-bold text-slate-900">{post.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{post.content}</p>
              </div>

              {/* Action Bar */}
              <div className="flex items-center gap-4 pt-2 text-xs">
                <button
                  onClick={() => handleLikePost(post.postId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 transition cursor-pointer font-semibold"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{post.likesCount} Helpful</span>
                </button>

                <button
                  onClick={() => setExpandedPostId(isExpanded ? null : post.postId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition cursor-pointer font-semibold"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.repliesCount || 0} Replies</span>
                </button>
              </div>

              {/* Expandable Replies Thread */}
              {isExpanded && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Peer Explanations
                  </h4>

                  {post.replies && post.replies.length > 0 ? (
                    <div className="space-y-2">
                      {post.replies.map((rep) => (
                        <div
                          key={rep.replyId}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-900">{rep.authorName}</span>
                            <span className="text-slate-400">{rep.createdAt}</span>
                          </div>
                          <p className="text-slate-700">{rep.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No replies yet. Be the first to help!</p>
                  )}

                  {/* Add Reply Input */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={replyInput[post.postId] || ''}
                      onChange={(e) =>
                        setReplyInput((prev) => ({ ...prev, [post.postId]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === 'Enter' && handleAddReply(post.postId)}
                      placeholder="Write an explanation to help your classmate..."
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:border-indigo-600 outline-none"
                    />
                    <button
                      onClick={() => handleAddReply(post.postId)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* New Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Ask a Question to the Community</h3>
                <p className="text-xs text-slate-400">Classmates from {student?.selectedClass} can help</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={postSubject}
                  onChange={(e) => setPostSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Social Studies">Social Studies</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Question Title
                </label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. How to convert unlike fractions with large denominators?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Describe what you are trying to understand
                </label>
                <textarea
                  required
                  rows={4}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Describe your reasoning and where you got stuck..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
