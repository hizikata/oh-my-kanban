
/** @jsxImportSource @emotion/react */
import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

import KanbanBoard from './KanbanBoard';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import KanbanNewCard from './KanbanNewCard';

// 不同区域背景色
const COLUMN_BG_COLORS = {
  loading: '#E3E3E3',
  todo: '#C9af97',
  ongoing: '#FFE799',
  done: '#C0E8BA'
}

const defaultTodoList = [{ title: '开发任务-1', status: '2022-05-22 18:15' }, { title: '开发任务-3', status: '2022-05-22 18:15' }, { title: '开发任务-5', status: '2022-05-22 18:15' }, { title: '测试任务-3', status: '2022-05-22 18:15' }];
const defaultOngoingList = [{ title: '开发任务-4', status: '22-05-22 18:15' }, { title: '开发任务-6', status: '2022-05-22 18:15' }, { title: '测试任务-2', status: '2022-05-22 18:15' }];
const defaultDoneList = [{ title: '开发任务-2', status: '2022-05-22 18:15' }, { title: '测试任务-1', status: '2022-05-22 18:15' }];

// 为了演示组件树写的没啥必要的子组件
const CustomTitle = ({ children }) => (
  <>
    {children}
  </>
);

export const MINUTE = 60 * 1000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const UPDATE_INTERVAL = MINUTE;

const DATA_STORE_KEY = 'kanban-data-store';

function App() {
  const [showAdd, setShowAdd] = useState(false);
  const [todoList, setTodoList] = useState(defaultTodoList);
  const [ongoingList, setOngoingList] = useState(defaultOngoingList);
  const [doneList, setDoneList] = useState(defaultDoneList);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = window.localStorage.getItem(DATA_STORE_KEY);
    setTimeout(() => {
      if (data) {
        const kanbanColumnData = JSON.parse(data);
        setTodoList(kanbanColumnData.todoList);
        setOngoingList(kanbanColumnData.ongoingList);
        setDoneList(kanbanColumnData.doneList);
      }
      setIsLoading(false)
    }, 1000);
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
        {isLoading ? (<KanbanColumn title='读取中。。。' bgColor={COLUMN_BG_COLORS.loading}></KanbanColumn>) : (
          <>
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
          </>
        )}
      </KanbanBoard>
    </div>
  );
}

export default App;
