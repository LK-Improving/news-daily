import React, { useState } from 'react';
import { history } from 'umi';
import { Avatar, Button, Card } from 'antd';
import styles from './index.less';
import { removeCookie } from '@/utils/cookie';
import { ReactComponent as Logo } from '@/assets/images/login/undraw_newspaper_re_syf5 (1).svg';
import { useModel } from '@@/plugin-model/useModel';
import { UserOutlined } from '@ant-design/icons/lib';
import { Column, Pie, ColumnConfig, PieConfig } from '@ant-design/plots';
import { useMount } from 'ahooks';
import { articleApi } from '@/services/api';
import { API } from '@/services/typings';

const Home: React.FC = () => {
  const [data, setData] = useState<API.CategoryType[]>([]);

  const { initialState, setInitialState } = useModel('@@initialState');

  const title = () => {
    const hour = new Date().getHours();
    if (hour > 6 && hour < 12) {
      return '你未来的模样，就藏在你的努力里！早安！';
    } else if (hour >= 12 && hour < 14) {
      return '朋友,中午好!愿你面带微笑,永远快乐!真切的祝福你。';
    } else if (hour >= 14 && hour < 18) {
      return '上天不会亏待努力的人,也不会同情假勤奋的人,你有多努力,时光它知道。下午好。';
    } else if (hour >= 18 && hour < 24) {
      return '一天的工作实在难捱,下班的时间终于到来,紧锁的眉头忽而放开,快乐的心情飞扬天外,晚上的节目早做安排:吃饭、喝酒、上网、聊天、外加收菜。祝:幸福充满八小时外!';
    } else {
      return '深夜了，请注意休息！';
    }
  };

  const init = async () => {
    const res = (await articleApi.reqChart()) as API.ResultType & {
      category: API.CategoryType[];
    };
    if (res && res.code === 0) {
      setData(res.category);
      console.log(res);
    }
  };

  useMount(() => {
    init();
  });

  const config: ColumnConfig = {
    data,
    xField: 'catName',
    yField: 'count',
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle',
      // 'top', 'bottom', 'middle',
      // 配置样式
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      catName: {
        alias: '分类',
      },
      count: {
        alias: '数量',
      },
    },
  };

  const config2: PieConfig = {
    appendPadding: 10,
    data,
    angleField: 'count',
    colorField: 'catName',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '20',
        },
        content: '各分类文章数量',
      },
    },
  };
  return (
    <div className={styles.container}>
      <Card>
        <b>工作台</b>
        <div className={styles.user}>
          <div style={{ lineHeight: '100px' }}>
            <Avatar
              style={{ backgroundColor: '#e98e97' }}
              size={64}
              icon={<UserOutlined />}
            />
          </div>
          <p>
            <span style={{ fontSize: 20, color: 'black' }}>
              {initialState?.currentUser?.username}
            </span>
            <br />
            {title()}
          </p>
          <Logo width={120} height={100} className={styles.loginImg} />
        </div>
      </Card>
      <div className={styles.chart}>
        <Card style={{ width: 500 }} title={'各分类下文章数量'}>
          <Column {...config} />
        </Card>
        <Card style={{ width: 400 }} title={'各分类下文章数量'}>
          <Pie {...config2} />
        </Card>
      </div>
    </div>
  );
};
export default Home;
