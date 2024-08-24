import {Ranking} from '@/constants/rankings';

export default function RankingItem(props:Ranking,identify:boolean) {

    if(identify){
        return (
            <>
                <li
                key ={props.rank}
                className='flex justify-between items-center p-3 rounded-lg bg-blue-100 text-blue-800'
                >
                    <span className="font-semibold">{`${props.rank}. ${props.name}`}</span>
                    <span className="text-sm text-gray-600">{props.contribution}コントリビュート</span>
                </li>
            </>
        )
    }else{
        return (
            <>
            <li
            key ={props.rank}
            className='flex justify-between items-center p-3 rounded-lg '
            >
                <span className="font-semibold">{`${props.rank}. ${props.name}`}</span>
                <span className="text-sm text-gray-600">{props.contribution}コントリビュート</span>
            </li>
        </>
    )
}
    

}