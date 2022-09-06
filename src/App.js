import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

const defaultTodoList = [{ title: '开发任务-1', status: '22-05-22 18:15' }, { title: '开发任务-3', status: '22-05-22 18:15' }, { title: '开发任务-5', status: '22-05-22 18:15' }, { title: '测试任务-3', status: '22-05-22 18:15' }];
const defaultOngoingList = [{ title: '开发任务-4', status: '22-05-22 18:15' }, { title: '开发任务-6', status: '22-05-22 18:15' }, { title: '测试任务-2', status: '22-05-22 18:15' }];
const defaultDoneList = [{ title: '开发任务-2', status: '22-05-22 18:15' }, { title: '测试任务-1', status: '22-05-22 18:15' }];

const KanbanBoard = ({ children }) => (
  <main className="kanban-board">{children}</main>
);
// 为了演示组件树写的没啥必要的子组件
const CustomTitle = ({ children }) => (
  <>
    {children}
  </>
);

const KanbanColumn = ({ children, className, title }) => {
  const combinedClassName = `kanban-column ${className}`
  return (
    <section className={combinedClassName}>
      <h2>{title}</h2>
      <ul>
        {children}
      </ul>
    </section>
  )
};

const KanbanCard = ({ title, status }) => {
  return (
    <li className='kanban-card'>
      <div className='card-title'>{title}</div>
      <div className='card-status'>{status}</div>
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
      console.log('enter trigger !!');
      onSubmit(title)
    }
  }
  return (
    <li className='kanban-card'>
      <h3>添加新卡片</h3>
      <div className='card-title'>
        <input type='text' value={title} onChange={handleChange} onKeyDown={handleKeyDown} />
      </div>
    </li>
  )
}

function App() {
  const [showAdd, setShowAdd] = useState(false);
  const [todoList, setTodoList] = useState(defaultTodoList);
  const [ongoingList] = useState(defaultOngoingList);
  const [doneList] = useState(defaultDoneList);
  const handleAdd = (evt) => {
    setShowAdd(true);
  }
  const handleSubmit = (title) => {
    // todoList.unshift({ title, status: new Date().toDateString() })
    setTodoList([
      { title, status: new Date().toDateString() },
      ...todoList
    ])
    setShowAdd(false);
  }
  return (
    <div className="App">
      <header className="App-header">
        <CustomTitle><h1>我的看板</h1></CustomTitle>
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
