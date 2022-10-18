import React, { useEffect, useState } from 'react';
import { MINUTE, HOUR, DAY, UPDATE_INTERVAL } from './App';

export default function KanbanCard({ title, status }) {
    const [displayTime, setDisplayTime] = useState(status);

    useEffect(() => {
        const updateDisplayTime = () => {
            const timePassed = new Date() - new Date(status);
            let relativeTime = '刚刚';
            if (MINUTE <= timePassed && timePassed < HOUR) {
                relativeTime = `${Math.ceil(timePassed / MINUTE)} 分钟前`;
            } else if (HOUR <= timePassed && timePassed < DAY) {
                relativeTime = `${Math.ceil(timePassed / HOUR)} 小时前`;
            } else if (DAY <= timePassed) {
                relativeTime = `${Math.ceil(timePassed / DAY)} 天前`;
            }
            setDisplayTime(relativeTime);
            // console.log('updating...')
        };
        const intervalId = setInterval(updateDisplayTime, UPDATE_INTERVAL);
        updateDisplayTime();
        // 副作用回调函数的返回值也是一个函数，叫做清除函数
        return function cleanup() {
            clearInterval(intervalId);
        };
    }, [status]);
    return (
        <li className='kanban-card'>
            <div className='card-title'>{title}</div>
            <div className='card-status' title={status}>{displayTime}</div>
        </li>
    );
}
