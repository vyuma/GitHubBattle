import {Ranking} from '@/constants/rankings';
import {userContributionType} from '@/constants/userContributionType';
import { RankingItem } from '@/components/RankingItem';



export default function RankingList(rankings:Ranking[],userId:string) {


    const isMe =(id:String,userId:String)=>{
        if(id===userId){
            return true
        }else{
            return false
        }
    }
    return (
        <>
        <ol>
            {rankings.map((ranking) => (
                    <RankingItem
                        name={ranking.name}
                        contribution={ranking.contribution}
                        rank={ranking.rank}
                        identify={isMe(ranking.id,userId)}
                    />
            ))}
        </ol>
        </>
    )


}



