import {RankingType} from '@/constants/rankings';

type RankingItemProps = {
    name: string;
    contribution: number;
    rank: number|string;
    identify: boolean;
};

const RankingItems: React.FC<RankingItemProps> = ({ name, contribution, rank, identify }) => {

    if(identify){
        return (
            <>
                <li
                key ={rank}
                className='flex justify-between items-center p-3 rounded-lg bg-blue-100 text-blue-800'
                >
                    <span className="font-semibold">{`${rank}. ${name}`}</span>
                    <span className="text-sm text-gray-600">{contribution}コントリビュート</span>
                </li>
            </>
        )
    }else{
        return (
            <>
            <li
            key ={rank}
            className='flex justify-between items-center p-3 rounded-lg '
            >
                <span className="font-semibold">{`${rank}. ${name}`}</span>
                <span className="text-sm text-gray-600">{contribution}コントリビュート</span>
            </li>
        </>
    )
}

}

export default RankingItems;