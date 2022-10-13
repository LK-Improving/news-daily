import React, { useState } from 'react';

export type RouteProps = {
  children: React.ReactElement;
};

const RightContent: React.FC<RouteProps> = (props) => {
  return (
    <div
      style={{
        background: 'white',
        height: 'calc(100vh - 90px)',
        padding: 20,
        overflowY: 'scroll',
      }}
    >
      {props.children}
    </div>
  );
};

export default RightContent;
