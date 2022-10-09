
/** @jsxImportSource @emotion/react */
import logo from './logo.svg';
import './App.css';
import React, { useEffect, useRef, useState } from 'react';

import { css } from '@emotion/react'
import KanbanBoard from './KanbanBoard';

const defaultTodoList = [{ title: '开发任务-1', status: '2022-05-22 18:15' }, { title: '开发任务-3', status: '2022-05-22 18:15' }, { title: '开发任务-5', status: '2022-05-22 18:15' }, { title: '测试任务-3', status: '2022-05-22 18:15' }];
const defaultOngoingList = [{ title: '开发任务-4', status: '22-05-22 18:15' }, { title: '开发任务-6', status: '2022-05-22 18:15' }, { title: '测试任务-2', status: '2022-05-22 18:15' }];
const defaultDoneList = [{ title: '开发任务-2', status: '2022-05-22 18:15' }, { title: '测试任务-1', status: '2022-05-22 18:15' }];

// 为了演示组件树写的没啥必要的子组件
const CustomTitle = ({ children }) => (
  <>
    {children}
  </>
);

const KanbanColumn = ({ children, className, title }) => {
  // const combinedClassName = `kanban-column ${className}`;
  return (
    <section className={className} css={css`
      flex: 1 1;
      display: flex;
      flex-direction: column;
      border: 1px solid gray;
      border-radius: 1rem;

      &>h2{
        margin:0.6rem 1rem;
        padding-bottom: 0.6rem;
        border-bottom: 1px solid gray;

        &>button{
          float: right;
          margin-top: 0.2rem;
          padding:0.2rem 0.5rem;
          border: 0;
          border-radius: 1rem;
          height: 1.8rem;
          line-height: 1rem;
          font-size: 1rem;
  }
      }

      &>ul{
        flex:1;
        flex-basis: 0;
        margin:1rem;
        padding:0;
        overflow: auto;
      }
    `}>
      <h2>{title}</h2>
      <ul>
        {children}
      </ul>
    </section>
  )
};

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const UPDATE_INTERVAL = MINUTE;

const KanbanCard = ({ title, status }) => {
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
  )
}

const KanbanNewCard = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const handleChange = (evt) => {
    setTitle(evt.target.value);
  }
  const handleKeyDown = (evt) => {
    if (evt.key === 'Enter') {
      // setTitle(evt.target.value);
      console.log('enter trigger !!');
      // onsubmit(title);
      onSubmit(title)
    }
  }

  const inputRef = useRef(null);
  useEffect(() => {
    const defaultTitle = 'hello world !!!'
    inputRef.current.value = defaultTitle;
    setTitle(defaultTitle);
    inputRef.current.focus();
    inputRef.current.select();
  }, [])
  return (
    <li className='kanban-card'>
      <h3>添加新卡片</h3>
      <div className='card-title'>
        <input type='text' ref={inputRef} value={title} onChange={handleChange} onKeyDown={handleKeyDown} />
      </div>
    </li>
  )
}

const DATA_STORE_KEY = 'kanban-data-store';

function App() {
  const [showAdd, setShowAdd] = useState(false);
  const [todoList, setTodoList] = useState(defaultTodoList);
  const [ongoingList, setOngoingList] = useState(defaultOngoingList);
  const [doneList, setDoneList] = useState(defaultDoneList);
  useEffect(() => {
    const data = window.localStorage.getItem(DATA_STORE_KEY);
    setTimeout(() => {
      if (data) {
        const kanbanColumnData = JSON.parse(data);
        setTodoList(kanbanColumnData.todoList);
        setOngoingList(kanbanColumnData.ongoingList);
        setDoneList(kanbanColumnData.doneList)
      }
    }, 100);
  }, [])

  const handleAdd = (evt) => {
    setShowAdd(true);
  }
  const handleSubmit = (title) => {
    // todoList.unshift({ title, status: new Date().toDateString() })
    const addItem = { title, status: new Date().toLocaleString() }
    setTodoList([
      addItem,
      ...todoList
    ])
    setShowAdd(false);
  }

  const handleSaveAll = () => {
    const data = JSON.stringify({
      todoList,
      ongoingList,
      doneList
    })
    window.localStorage.setItem(DATA_STORE_KEY, data)
    alert('数据保存成功！！')
  }

  return (
    <div className="App">
      <header className="App-header">
        <CustomTitle>
          <h1>我的看板
            <button onClick={handleSaveAll}>保存所有卡片</button>
          </h1></CustomTitle>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <KanbanBoard>
        <KanbanColumn className='column-todo' title={
          <CustomTitle>
            待处理
            <button onClick={handleAdd} disabled={showAdd}>&#8853; 添加新卡片</button>
          </CustomTitle>
        }>
          {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
          {
            // 这是注释
            todoList.map((props, index) => <KanbanCard key={props.title} {...props} index={index} />)
          }
        </KanbanColumn>
        <KanbanColumn className='column-ongoing' title='进行中'>
          {
            ongoingList.map((props, index) => <KanbanCard key={props.title} {...props} index={index} />)
          }
        </KanbanColumn>
        <KanbanColumn className='column-done' title='已完成'>
          {
            doneList.map((props, index) => <KanbanCard key={props.title} {...props} index={index} />)
          }
        </KanbanColumn>
      </KanbanBoard>
    </div>
  );
}

export default App;
