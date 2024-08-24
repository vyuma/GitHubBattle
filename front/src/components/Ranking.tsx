
import {RankingItem} from '@/constants/rankingItem';  
import {userContributionType} from '@/constants/userContributionType';

export default function Ranking(displayRankings:RankingItem[],userRank:userContributionType) {
    return (
        {displayRankings.map((item, index) => (
            <li
                key={index}
                className={`flex justify-between items-center p-3 rounded-lg ${
                    item.name === (view === "user" ? userId : currentCommunity)
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-50"
                }`}
            >
                <span className="font-semibold">{`${item.rank}. ${item.name}`}</span>
                <span className="text-sm text-gray-600">
                    {item.commits}コントリビュート
                </span>
            </li>
            ))
        }
    )

}