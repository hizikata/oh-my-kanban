/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

export default function KanbanColumn({ children, className, title }) {
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
  );
}
