import React, { useState, useMemo } from 'react';
import { Button, Box, Callout, Field } from '@rocket.chat/fuselage';
import { useMutableCallback } from '@rocket.chat/fuselage-hooks';

import MonitorsTable from './MonitorsTable';
import Page from '../../components/Page';
import NotAuthorizedPage from '../../components/NotAuthorizedPage';
import PageSkeleton from '../../components/PageSkeleton';
import { AsyncStatePhase } from '../../hooks/useAsyncState';
import { useEndpointData } from '../../hooks/useEndpointData';
import { useHasLicense } from '../../hooks/useHasLicense';
import { useMethod } from '../../contexts/ServerContext';
import { UserAutoComplete } from '../../components/AutoComplete';
import { useToastMessageDispatch } from '../../contexts/ToastMessagesContext';
import { useTranslation } from '../../contexts/TranslationContext';

const sortDir = (sortDir) => (sortDir === 'asc' ? 1 : -1);

const useQuery = ({ text, itemsPerPage, current }, [column, direction]) => useMemo(() => ({
	text,
	sort: JSON.stringify({ [column]: sortDir(direction) }),
	...itemsPerPage && { count: itemsPerPage },
	...current && { offset: current },
}), [text, itemsPerPage, current, column, direction]);

const MonitorsPageContainer = () => {
	const license = useHasLicense('livechat-enterprise');

	if (license === 'loading') {
		return <PageSkeleton />;
	}

	if (!license) {
		return <NotAuthorizedPage />;
	}

	return <MonitorsPage />;
};

const MonitorsPage = () => {
	const t = useTranslation();
	const dispatchToastMessage = useToastMessageDispatch();

	const [params, setParams] = useState(() => ({ current: 0, itemsPerPage: 25, text: '' }));
	const [sort, setSort] = useState(['name', 'asc']);
	const [username, setUsername] = useState('');

	const { value: data, phase: state, reload } = useEndpointData('livechat/monitors.list', useQuery(params, sort));

	const addMonitor = useMethod('livechat:addMonitor');

	const onHeaderClick = useMutableCallback((id) => {
		const [sortBy, sortDirection] = sort;

		if (sortBy === id) {
			setSort([id, sortDirection === 'asc' ? 'desc' : 'asc']);
			return;
		}
		setSort([id, 'asc']);
	});

	const handleAdd = useMutableCallback(async () => {
		try {
			await addMonitor(username);
			reload();
			setUsername('');
			dispatchToastMessage({ type: 'success', message: t('Monitor_added') });
		} catch (error) {
			dispatchToastMessage({ type: 'error', message: error });
		}
	});

	if (state === AsyncStatePhase.REJECTED) {
		return <Callout>
			{t('Error')}
		</Callout>;
	}

	return <Page flexDirection='row'>
		<Page>
			<Page.Header title={t('Livechat_Monitors')} />
			<Page.Content>
				<Box display='flex' flexDirection='1'>
					<Field>
						<Field.Label>{t('Username')}</Field.Label>
						<Field.Row>
							<UserAutoComplete value={username} onChange={setUsername}/>
							<Button primary disabled={!username} onClick={handleAdd} mis='x8'>{t('Add')}</Button>
						</Field.Row>
					</Field>
				</Box>
				<MonitorsTable
					monitors={data?.monitors}
					totalMonitors={data?.total}
					params={params}
					onChangeParams={setParams}
					onHeaderClick={onHeaderClick}
					sort={sort}
					onDelete={reload}
				/>
			</Page.Content>
		</Page>
	</Page>;
};

export default MonitorsPageContainer;