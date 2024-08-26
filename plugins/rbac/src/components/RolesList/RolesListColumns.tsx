import React from 'react';

import { parseEntityRef } from '@backstage/catalog-model';
import { Link, TableColumn } from '@backstage/core-components';

import { Tooltip, Typography } from '@material-ui/core';

import { RolesData } from '../../types';
import { getMembers } from '../../utils/rbac-utils';
import EditRole from '../EditRole';
import DeleteRole from './DeleteRole';

export const columns: TableColumn<RolesData>[] = [
  {
    title: 'Name',
    field: 'name',
    type: 'string',
    render: (props: RolesData) => {
      const { kind, namespace, name } = parseEntityRef(props.name);
      return (
        <Link to={`roles/${kind}/${namespace}/${name}`}>{props.name}</Link>
      );
    },
  },
  {
    title: 'Users and groups',
    field: 'members',
    type: 'string',
    align: 'left',
    render: props => getMembers(props.members),
    customSort: (a, b) => {
      if (a.members.length === 0) {
        return -1;
      }
      if (b.members.length === 0) {
        return 1;
      }
      if (a.members.length === b.members.length) {
        return 0;
      }
      return a.members.length < b.members.length ? -1 : 1;
    },
  },
  {
    title: 'Accessible plugins',
    field: 'accessiblePlugins',
    type: 'string',
    align: 'left',
    render: (props: RolesData) => {
      const pls = props.accessiblePlugins.map(
        p => p[0].toUpperCase() + p.slice(1),
      );
      const plsTooltip = pls.join(', ');
      const plsOverflowCount = pls.length > 2 ? `+ ${pls.length - 2}` : '';

      return pls.length > 0 ? (
        <Tooltip title={plsTooltip || ''} placement="top-start">
          <Typography>
            {pls.length === 1
              ? `${pls[0]}`
              : `${pls[0]}, ${pls[1]} ${plsOverflowCount}`}
          </Typography>
        </Tooltip>
      ) : (
        '-'
      );
    },
  },
  {
    title: 'Actions',
    sorting: false,
    render: (props: RolesData) => (
      <>
        <EditRole
          dataTestId={
            !props.actionsPermissionResults.edit.allowed
              ? `disable-update-role-${props.name}`
              : `update-role-${props.name}`
          }
          roleName={props.name}
          disable={!props.actionsPermissionResults.edit.allowed}
          tooltip={
            !props.actionsPermissionResults.edit.allowed
              ? 'Unauthorized to edit'
              : ''
          }
        />
        <DeleteRole
          dataTestId={
            !props.actionsPermissionResults.delete.allowed
              ? `disable-delete-role-${props.name}`
              : `delete-role-${props.name}`
          }
          roleName={props.name}
          disable={!props.actionsPermissionResults.delete.allowed}
          tooltip={
            !props.actionsPermissionResults.delete.allowed
              ? 'Role cannot be deleted'
              : ''
          }
        />
      </>
    ),
  },
];
