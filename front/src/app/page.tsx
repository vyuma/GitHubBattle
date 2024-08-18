import Link from 'next/link';

const Home = () => {
    return (
        <>
            <h1>GitHub Battles</h1>

            <h1>~~(アプリの簡単な紹介)~~</h1>

            <Link href="/login">ログイン</Link>
            <br />
            <Link href="/register">新規登録</Link>
        </>
    );
};

export default Home;
