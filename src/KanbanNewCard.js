import React, { useEffect, useRef, useState } from 'react';

export default function KanbanNewCard({ onSubmit }) {
    const [title, setTitle] = useState('');
    const handleChange = (evt) => {
        setTitle(evt.target.value);
    };
    const handleKeyDown = (evt) => {
        if (evt.key === 'Enter') {
            // setTitle(evt.target.value);
            console.log('enter trigger !!');
            // onsubmit(title);
            onSubmit(title);
        }
    };

    const inputRef = useRef(null);
    useEffect(() => {
        const defaultTitle = 'hello world !!!';
        inputRef.current.value = defaultTitle;
        setTitle(defaultTitle);
        inputRef.current.focus();
        inputRef.current.select();
    }, []);
    return (
        <li className='kanban-card'>
            <h3>添加新卡片</h3>
            <div className='card-title'>
                <input type='text' ref={inputRef} value={title} onChange={handleChange} onKeyDown={handleKeyDown} />
            </div>
        </li>
    );
}
