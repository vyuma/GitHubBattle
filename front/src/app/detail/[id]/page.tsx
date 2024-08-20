// そもそもこのページにたどり着くために、どうやってidを動的に取得するのかはわからない

import Link from 'next/link';

const CommunityDetail: React.FC = () => {
    return (
        <div>
            <h1>クリックされたcommunityの詳細</h1>

            <p>コミュニティ名</p>
            <p>コミュニティ詳細</p>
            <p>tagなど</p>
            <p>tagなど</p>

            <Link href="/">ホーム</Link>
        </div>
    );
};

export default CommunityDetail;
