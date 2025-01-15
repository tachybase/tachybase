import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { useLocation, useMatch, useNavigate, useParams } from 'react-router';

import { useRequest } from '../../api-client';
import { useAdminSchemaUid } from '../../hooks';
import { findByUid, findMenuItem, SchemaComponent } from '../../schema-component';
import { useACLRoleContext } from '../acl';
import { useDocumentTitle } from '../document-title';
import { filterByACL } from './filterByACL';

export const SchemaIdContext = createContext(null);
SchemaIdContext.displayName = 'SchemaIdContext';
export const useMenuProps = () => {
  const defaultSelectedUid = useContext(SchemaIdContext);
  return {
    selectedUid: defaultSelectedUid,
    defaultSelectedUid,
  };
};

export const MenuEditor = (props) => {
  const { sideMenuRef } = props;
  const { setTitle } = useDocumentTitle();
  const navigate = useNavigate();
  const params = useParams<any>();
  const location = useLocation();
  const isMatchAdmin = useMatch('/admin');
  const isMatchAdminName = useMatch('/admin/:name');
  const defaultSelectedUid = params.name;
  const ctx = useACLRoleContext();
  const [current, setCurrent] = useState(null);
  const onSelect = ({ item }) => {
    const schema = item.props.schema || {};
    setTitle(schema.title);
    setCurrent(schema);
    navigate(`/admin/${schema['x-uid']}`);
  };
  const adminSchemaUid = useAdminSchemaUid();
  const { data, loading } = useRequest<{
    data: any;
  }>(
    {
      url: `/uiSchemas:getJsonSchema/${adminSchemaUid}`,
    },
    {
      refreshDeps: [adminSchemaUid],
      onSuccess(data) {
        const schema = filterByACL(data?.data, ctx);
        // url 为 `/admin` 的情况
        if (isMatchAdmin) {
          const s = findMenuItem(schema);
          if (s) {
            navigate(`/admin/${s['x-uid']}`);
            setTitle(s.title);
          } else {
            navigate(`/admin/`);
          }
          return;
        }

        // url 不为 `/admin/xxx` 的情况，不做处理
        if (!isMatchAdminName) return;

        // url 为 `admin/xxx` 的情况
        const s = findByUid(schema, defaultSelectedUid);
        if (s) {
          setTitle(s.title);
        } else {
          const s = findMenuItem(schema);

          if (s) {
            navigate(`/admin/${s['x-uid']}`);
            setTitle(s.title);
          } else {
            navigate(`/admin/`);
          }
        }
      },
    },
  );

  const match = useMatch('/admin/:name');

  useEffect(() => {
    if (match) {
      const schema = filterByACL(data?.data, ctx);
      const s = findByUid(schema, defaultSelectedUid);
      if (s) {
        setTitle(s.title);
      }
    }
  }, [data?.data, location.pathname, defaultSelectedUid]);

  useEffect(() => {
    const properties = Object.values(current?.root?.properties || {}).shift()?.['properties'] || data?.data?.properties;
    if (sideMenuRef?.current) {
      const pageType =
        properties &&
        Object.values(properties).find((item) => item['x-uid'] === params.name && item['x-component'] === 'Menu.Item');
      const isSettingPage = location?.pathname.includes('/settings');
      if (pageType || isSettingPage) {
        sideMenuRef.current.style.display = 'none';
      } else {
        sideMenuRef.current.style.display = 'block';
      }
    }
  }, [data?.data, params.name, sideMenuRef]);

  const schema = useMemo(() => {
    const s = filterByACL(data?.data, ctx);
    if (s?.['x-component-props']) {
      s['x-component-props']['useProps'] = useMenuProps;
    }
    return s;
  }, [data?.data]);

  if (loading) {
    return;
  }
  return (
    <SchemaIdContext.Provider value={defaultSelectedUid}>
      <SchemaComponent memoized scope={{ useMenuProps, onSelect, sideMenuRef, defaultSelectedUid }} schema={schema} />
    </SchemaIdContext.Provider>
  );
};
