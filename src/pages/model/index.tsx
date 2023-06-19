import React, { useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import ModelList from './components/ModelList';
import dynamic from 'next/dynamic';
import { useUserStore } from '@/store/user';
import { useGlobalStore } from '@/store/global';
import Loading from '@/components/Loading';
import SideBar from '@/components/SideBar';
import Tour from 'reactour';

const ModelDetail = dynamic(() => import('./components/detail/index'), {
  loading: () => <Loading fixed={false} />,
  ssr: false
});

// 定义跳过按钮样式
const skipButtonStyles = {
  color: 'orange',
  fontWeight: 'bold',
  textDecoration: 'underline'
};

// 定义跳过按钮组件
const SkipButton = ({ close }) => (
  <button
    onClick={() => {
      close(); // 关闭新手引导
      if (typeof window !== 'undefined') {
        localStorage.setItem('tourCompleted', 'true'); // 更新本地存储
      }
    }}
    style={skipButtonStyles}
  >
    跳过
  </button>
);

const steps = [
  {
    selector: '.guide-my-app',
    content: ({ close }) => (
      <div>
        欢迎来到AI知识库应用！首先，这是您的应用列表。
        <SkipButton close={close} />
      </div>
    )
  },
  {
    selector: '.add-new-app',
    content: ({ close }) => (
      <div>
        通过点击按钮新建应用。
        <SkipButton close={close} />
      </div>
    )
  },
  {
    selector: '.setup-temperature',
    content: ({ close }) => (
      <div>
        应用详情里，您可以调节模型温度值。数值越大，AI的回答越发散，越小则越严谨。
        <SkipButton close={close} />
      </div>
    )
  },
  {
    selector: '.add-system-prompt',
    content: ({ close }) => (
      <div>
        预设输入提示词，引导AI聊天方向。
        <SkipButton close={close} />
      </div>
    )
  },
  {
    selector: '.select-kb-btn',
    content: ({ close }) => (
      <div>
        选择自定义的知识库。
        <SkipButton close={close} />
      </div>
    )
  },
  {
    selector: '.share-model-setting',
    content: ({ close }) => (
      <div>
        选择分享模型与否，分享的模型将会出现在应用市场中。
        <SkipButton close={close} />
      </div>
    )
  },
  {
    selector: '.app-delete',
    content: ({ close }) => (
      <div>
        删除应用在这里，请谨慎操作。
        <SkipButton close={close} />
      </div>
    )
  },
  {
    selector: '.app-save-setting',
    content: ({ close }) => (
      <div>
        别忘了保存设置！
        <SkipButton close={close} />
      </div>
    )
  },
  {
    selector: '.begin-chat',
    content: '下面可以开始与ai对话咯！'
  }

  // 更多步骤...
];

const Model = ({ modelId }: { modelId: string }) => {
  const router = useRouter();
  const { isPc } = useGlobalStore();
  const { lastModelId } = useUserStore();

  const [isTourOpen, setIsTourOpen] = useState(false);

  // redirect modelId
  useEffect(() => {
    if (isPc && !modelId && lastModelId) {
      router.replace(`/model?modelId=${lastModelId}`);
    }
  }, [isPc, lastModelId, modelId, router]);

  // Check if we should start the tour
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const tourCompleted = localStorage.getItem('tourCompleted');

  //     if (!tourCompleted) {
  //       setIsTourOpen(true);
  //     }
  //   }
  // }, []);

  // Update localStorage when the tour is closed
  // useEffect(() => {
  //   if (typeof window !== 'undefined' && !isTourOpen) {
  //     localStorage.setItem('tourCompleted', 'true');
  //   }
  // }, [isTourOpen]);

  // Check if we should start the tour
  useEffect(() => {
    // Replace this with your actual logic
    const shouldStartTour = true;

    if (shouldStartTour) {
      setIsTourOpen(true);
    }
  }, []);

  return (
    <Flex h={'100%'} position={'relative'} overflow={'hidden'}>
      {/* 模型列表 */}
      {(isPc || !modelId) && (
        <SideBar w={['100%', '0 0 250px', '0 0 270px', '0 0 290px']}>
          <ModelList modelId={modelId} />
        </SideBar>
      )}
      <Box flex={1} h={'100%'} position={'relative'}>
        {modelId && <ModelDetail modelId={modelId} isPc={isPc} />}
      </Box>

      <Tour steps={steps} isOpen={isTourOpen} onRequestClose={() => setIsTourOpen(false)} />
    </Flex>
  );
};

export default Model;

Model.getInitialProps = ({ query, req }: any) => {
  return {
    modelId: query?.modelId || ''
  };
};
