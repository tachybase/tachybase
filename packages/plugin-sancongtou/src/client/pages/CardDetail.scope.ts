import { useCollectionRecordData } from '@tachybase/client';

export const useScopeCardDetail = () => {
  const data = useCollectionRecordData();
  const { ['main_images']: mainImages = [] } = data || {};
  const images = mainImages.map((image) => image.url);

  return {
    images,
  };
};
