import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Flame, Heart, LogOut, MessageCircle, Send, Users, ArrowLeft, HelpCircle } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import {
  getCommunityFirebase as getFirebase,
  isCommunityFirebaseConfigured as isFirebaseConfigured,
} from "@/lib/firebase-community";
import { MUMBAI_LOCALITIES } from "@/lib/mumbai-localities";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community Lounges — Maaya" },
      { name: "description", content: "Locality-based beauty discussions for Mumbai — Bandra, Andheri, Juhu, Powai and more." },
      { property: "og:title", content: "Community Lounges — Maaya" },
      { property: "og:description", content: "Locality-based beauty discussions for Mumbai." },
    ],
  }),
  component: CommunityPage,
});

const USER_KEY = "maaya:community:user";
const ROOM_KEY = "maaya:community:room";

type Post = {
  id: string;
  username: string;
  text: string;
  ts: number;
  likes?: Record<string, true>;
  comments?: Record<string, { id: string; username: string; text: string; ts: number }>;
};

function CommunityPage() {
  const { t } = useT();
  const [username, setUsername] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    const u = localStorage.getItem(USER_KEY);
    const r = localStorage.getItem(ROOM_KEY);
    if (u) setUsername(u);
    if (r) setRoomId(r);
  }, []);

  const setRoom = (id: string | null) => {
    setRoomId(id);
    if (id) localStorage.setItem(ROOM_KEY, id);
    else localStorage.removeItem(ROOM_KEY);
  };

  const setUser = (u: string | null) => {
    setUsername(u);
    if (u) localStorage.setItem(USER_KEY, u);
    else localStorage.removeItem(USER_KEY);
  };

  const room = MUMBAI_LOCALITIES.find((l) => l.id === roomId) ?? null;

  return (
    <div className="min-h-screen bg-cream text-midnight">
      <SiteNav />

      {!room ? (
        <RoomPicker onPick={(id) => setRoom(id)} t={t} />
      ) : !username ? (
        <UsernameCard
          roomName={room.name}
          onLogin={(name) => setUser(name)}
          onBack={() => setRoom(null)}
          t={t}
        />
      ) : (
        <Lounge
          roomId={room.id}
          roomName={room.name}
          username={username}
          onLogout={() => setUser(null)}
          onChangeRoom={() => setRoom(null)}
          t={t}
        />
      )}
    </div>
  );
}

function RoomPicker({ onPick, t }: { onPick: (id: string) => void; t: ReturnType<typeof useT>["t"] }) {
  return (
    <main className="pt-32 pb-20 px-6">
      <div className="container-x">
        <p className="text-rosy text-xs uppercase tracking-[0.3em] mb-4 animate-rise-in">
          {t("community.kicker")}
        </p>
        <h1
          className="font-display text-4xl md:text-6xl text-midnight leading-tight max-w-3xl animate-rise-in"
          style={{ animationDelay: "120ms" }}
        >
          {t("community.title")}
        </h1>
        <p
          className="mt-5 max-w-xl text-sm md:text-base text-muted-foreground animate-rise-in"
          style={{ animationDelay: "240ms" }}
        >
          {t("community.askDesc")}
        </p>

        <div className="mt-12">
          <p className="text-xs uppercase tracking-widest text-darkgreen mb-4 inline-flex items-center gap-2">
            <Users className="h-3.5 w-3.5" /> {t("community.chooseRoom")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {MUMBAI_LOCALITIES.map((l, i) => (
              <button
                key={l.id}
                onClick={() => onPick(l.id)}
                style={{ animationDelay: `${i * 30}ms` }}
                className="group relative rounded-2xl bg-cream border border-border/70 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-darkgreen hover:shadow-[0_18px_36px_-18px_rgba(0,0,0,0.35)] animate-rise-in"
              >
                <p className="font-display text-2xl text-midnight leading-tight">{l.name}</p>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground group-hover:text-rosy transition-colors">
                  Enter lounge →
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function UsernameCard({
  roomName,
  onLogin,
  onBack,
  t,
}: {
  roomName: string;
  onLogin: (name: string) => void;
  onBack: () => void;
  t: ReturnType<typeof useT>["t"];
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-28 pb-16">
      <div className="w-full max-w-md rounded-3xl bg-midnight text-cream p-8 md:p-10 shadow-xl border border-cream/10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-cream/60 hover:text-rosy mb-6"
        >
          <ArrowLeft className="h-3 w-3" /> {t("community.changeRoom")}
        </button>
        <div className="flex items-center gap-2 text-rosy text-xs uppercase tracking-[0.25em] mb-3">
          <Users className="h-4 w-4" /> {roomName}
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">{t("community.enter")}</h1>
        <p className="text-cream/70 text-sm mb-7">
          Pick a username — no passwords, no friction.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = value.trim();
            if (v.length < 2) {
              setError("Please enter at least 2 characters.");
              return;
            }
            onLogin(v);
          }}
          className="space-y-4"
        >
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-cream/60">
              {t("community.username")}
            </span>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
              placeholder="e.g. anaya_b"
              className="mt-2 w-full rounded-full bg-cream/10 border border-cream/15 px-5 py-3 text-cream placeholder:text-cream/40 outline-none focus:border-rosy"
              maxLength={24}
              autoFocus
            />
          </label>
          {error && <p className="text-rosy text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-rosy text-midnight font-medium uppercase tracking-widest text-sm py-3 hover:bg-cream transition-colors"
          >
            {t("community.enter")}
          </button>
        </form>
      </div>
    </main>
  );
}

function Lounge({
  roomId,
  roomName,
  username,
  onLogout,
  onChangeRoom,
  t,
}: {
  roomId: string;
  roomName: string;
  username: string;
  onLogout: () => void;
  onChangeRoom: () => void;
  t: ReturnType<typeof useT>["t"];
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    let cancelled = false;
    (async () => {
      const fb = getFirebase();
      if (!fb) return;
      const { ref, onValue, query, orderByChild, limitToLast } = await import("firebase/database");
      const postsRef = query(
        ref(fb.db, `community/rooms/${roomId}/posts`),
        orderByChild("ts"),
        limitToLast(100),
      );
      const handler = onValue(postsRef, (snap) => {
        if (cancelled) return;
        const list: Post[] = [];
        snap.forEach((child) => {
          list.push({ id: child.key as string, ...(child.val() as Omit<Post, "id">) });
        });
        list.sort((a, b) => b.ts - a.ts);
        setPosts(list);
        setConnected(true);
      });
      unsub = () => handler();
    })();
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [roomId]);

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    const fb = getFirebase();
    if (!fb) return;
    const { ref, push, serverTimestamp } = await import("firebase/database");
    await push(ref(fb.db, `community/rooms/${roomId}/posts`), {
      username,
      text: v,
      ts: serverTimestamp(),
    });
    setText("");
  };

  const toggleLike = async (postId: string, liked: boolean) => {
    const fb = getFirebase();
    if (!fb) return;
    const { ref, set, remove } = await import("firebase/database");
    const path = `community/rooms/${roomId}/posts/${postId}/likes/${username}`;
    if (liked) await remove(ref(fb.db, path));
    else await set(ref(fb.db, path), true);
  };

  const addComment = async (postId: string, comment: string) => {
    const fb = getFirebase();
    if (!fb) return;
    const { ref, push, serverTimestamp } = await import("firebase/database");
    await push(ref(fb.db, `community/rooms/${roomId}/posts/${postId}/comments`), {
      username,
      text: comment,
      ts: serverTimestamp(),
    });
  };

  // User stats for profile card
  const myStats = useMemo(() => {
    const myPosts = posts.filter((p) => p.username === username).length;
    const myComments = posts.reduce(
      (acc, p) =>
        acc +
        Object.values(p.comments ?? {}).filter((c) => c.username === username).length,
      0,
    );
    return { posts: myPosts, comments: myComments };
  }, [posts, username]);

  const trending = useMemo(
    () =>
      [...posts]
        .sort(
          (a, b) =>
            (Object.keys(b.likes ?? {}).length + Object.keys(b.comments ?? {}).length) -
            (Object.keys(a.likes ?? {}).length + Object.keys(a.comments ?? {}).length),
        )
        .slice(0, 4),
    [posts],
  );

  return (
    <main className="pt-28 pb-16 px-4 md:px-6">
      <div className="container-x grid lg:grid-cols-[280px_1fr_300px] gap-6">
        {/* Left — profile + room nav */}
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl bg-midnight text-cream p-5">
            <p className="text-[10px] uppercase tracking-widest text-rosy mb-2">{roomName}</p>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-rosy text-midnight grid place-items-center font-bold text-lg">
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{username}</p>
                <p className="text-[11px] uppercase tracking-widest text-cream/60">
                  {t("community.signedInAs")}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="rounded-2xl bg-cream/10 p-3 text-center">
                <p className="font-display text-2xl">{myStats.posts}</p>
                <p className="text-[10px] uppercase tracking-widest text-cream/60">
                  {t("community.posts")}
                </p>
              </div>
              <div className="rounded-2xl bg-cream/10 p-3 text-center">
                <p className="font-display text-2xl">{myStats.comments}</p>
                <p className="text-[10px] uppercase tracking-widest text-cream/60">
                  {t("community.comments")}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={onChangeRoom}
                className="flex-1 rounded-full bg-cream/10 hover:bg-cream/20 text-cream text-[11px] uppercase tracking-widest py-2.5 transition-colors"
              >
                {t("community.changeRoom")}
              </button>
              <button
                onClick={onLogout}
                aria-label={t("community.logout")}
                className="grid place-items-center rounded-full bg-red-600/90 hover:bg-red-600 text-white h-10 w-10"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-rosy/15 border border-rosy/40 p-5">
            <p className="inline-flex items-center gap-2 text-darkgreen text-[10px] uppercase tracking-widest mb-2">
              <HelpCircle className="h-3.5 w-3.5" /> {t("community.askTitle")}
            </p>
            <p className="text-sm text-midnight/80 leading-relaxed">{t("community.askDesc")}</p>
          </div>
        </aside>

        {/* Middle — feed */}
        <section className="space-y-5">
          {!isFirebaseConfigured && (
            <div className="rounded-2xl bg-rosy/20 border border-rosy/40 text-midnight p-4 text-sm">
              {t("community.notConfigured")}
            </div>
          )}

          <form
            onSubmit={submitPost}
            className="rounded-3xl bg-cream border border-border/70 p-5 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.2)]"
          >
            <p className="text-[11px] uppercase tracking-widest text-darkgreen mb-3">
              {roomName} · {t("community.startPost")}
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("community.startPost")}
              rows={3}
              maxLength={500}
              disabled={!isFirebaseConfigured}
              className="w-full bg-transparent text-midnight placeholder:text-muted-foreground outline-none resize-none border-b border-border/60 pb-3"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px] text-muted-foreground">{text.length}/500</span>
              <button
                type="submit"
                disabled={!isFirebaseConfigured || !text.trim()}
                className="inline-flex items-center gap-1.5 rounded-full bg-midnight text-cream text-[11px] uppercase tracking-widest px-4 py-2 hover:bg-darkgreen transition-colors disabled:opacity-50"
              >
                <Send className="h-3 w-3" /> {t("community.post")}
              </button>
            </div>
          </form>

          <div>
            <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-darkgreen mb-3">
              <MessageCircle className="h-3.5 w-3.5" /> {t("community.recent")}
            </p>
            {posts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-cream p-10 text-center text-sm text-muted-foreground">
                {connected ? t("community.empty") : "Connecting…"}
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((p) => (
                  <PostCard
                    key={p.id}
                    post={p}
                    me={username}
                    onLike={() =>
                      toggleLike(p.id, !!(p.likes && p.likes[username]))
                    }
                    onComment={(c) => addComment(p.id, c)}
                    t={t}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Right — trending */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl bg-cream border border-border/70 p-5">
            <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-rosy mb-4">
              <Flame className="h-3.5 w-3.5" /> {t("community.trending")}
            </p>
            {trending.length === 0 ? (
              <p className="text-xs text-muted-foreground">No trending posts yet.</p>
            ) : (
              <ul className="space-y-3">
                {trending.map((p) => (
                  <li key={p.id} className="text-sm">
                    <p className="text-midnight line-clamp-2 leading-snug">{p.text}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                      @{p.username} · {Object.keys(p.likes ?? {}).length} {t("community.likes")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

function PostCard({
  post,
  me,
  onLike,
  onComment,
  t,
}: {
  post: Post;
  me: string;
  onLike: () => void;
  onComment: (text: string) => void;
  t: ReturnType<typeof useT>["t"];
}) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const likeCount = Object.keys(post.likes ?? {}).length;
  const iLiked = !!(post.likes && post.likes[me]);
  const comments = Object.values(post.comments ?? {}).sort((a, b) => a.ts - b.ts);

  const time = post.ts
    ? new Date(post.ts).toLocaleString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <article className="rounded-3xl bg-cream border border-border/70 p-5 transition-all duration-300 hover:border-darkgreen/40 hover:shadow-[0_18px_36px_-22px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-midnight text-cream grid place-items-center font-semibold">
          {post.username.charAt(0).toUpperCase()}
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-midnight">
            {post.username} {post.username === me && <span className="text-[10px] text-muted-foreground">(you)</span>}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{time}</p>
        </div>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed whitespace-pre-wrap break-words text-midnight">
        {post.text}
      </p>
      <div className="mt-4 flex items-center gap-4 text-xs">
        <button
          onClick={onLike}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
            iLiked ? "bg-rosy text-cream" : "bg-beige text-midnight hover:bg-rosy/40"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${iLiked ? "fill-current" : ""}`} /> {likeCount}
        </button>
        <button
          onClick={() => setShowComments((s) => !s)}
          className="inline-flex items-center gap-1.5 rounded-full bg-beige text-midnight px-3 py-1.5 hover:bg-darkgreen/15 transition-colors"
        >
          <MessageCircle className="h-3.5 w-3.5" /> {comments.length} {t("community.comments")}
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-border/60 space-y-3">
          {comments.map((c, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-7 w-7 shrink-0 rounded-full bg-darkgreen text-cream grid place-items-center text-[11px] font-semibold">
                {c.username.charAt(0).toUpperCase()}
              </div>
              <div className="bg-beige/70 rounded-2xl px-3 py-2 flex-1">
                <p className="text-[12px] font-semibold text-midnight">{c.username}</p>
                <p className="text-sm text-midnight leading-snug">{c.text}</p>
              </div>
            </div>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const v = commentText.trim();
              if (!v) return;
              onComment(v);
              setCommentText("");
            }}
            className="flex gap-2"
          >
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t("community.addComment")}
              maxLength={300}
              className="flex-1 rounded-full bg-beige px-4 py-2 text-sm text-midnight outline-none focus:bg-cream border border-transparent focus:border-darkgreen/40"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="rounded-full bg-midnight text-cream text-[11px] uppercase tracking-widest px-4 py-2 hover:bg-darkgreen transition-colors disabled:opacity-50"
            >
              {t("community.reply")}
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
