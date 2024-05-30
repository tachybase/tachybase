import { useRequest } from '@tachybase/client';

interface IPluginDetailData {
  packageJson: PackageJSON;
}

interface PackageJSON {
  name: string;
  version: string;
  description?: string;
  repository?: string | { type: string; url: string };
  homepage?: string;
  license?: string;
  devDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
}

export const usePluginVersion = () => {
  const { data } = useRequest<{ data: IPluginDetailData }>({
    url: 'hera:version',
  });
  return data?.data?.packageJson?.version;
};
