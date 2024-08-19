import Link from 'next/link';

const Home: React.FC = () => {
    return (
        <div>
            <h1>GitHub Battle</h1>

            <h1>~~(アプリの簡単な紹介)~~</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. <br />
                Cumque doloremque unde dicta libero? Accusamus reiciendis officiis <br />
                ipsa possimus cupiditate esse nostrum, veritatis, ratione deleniti,<br />
                 illo sed minus fugiat modi nesciunt.<br />
            Explicabo consequuntur beatae temporibus! Porro sequi dolorum iste, <br />
            a unde et iusto in eligendi expedita consequuntur id commodi!<br />
             Consequatur harum fugit assumenda sequi animi expedita itaque magnam, quis odio velit.</p>

            <Link href="/login">ログイン</Link>
            &nbsp;&nbsp;&nbsp;
            <Link href="/register">新規登録</Link>
        </div>
    );
};

export default Home;
