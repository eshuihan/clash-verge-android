import {
  CheckCircleOutlined,
  DeveloperBoardOutlined,
  MonitorHeartOutlined,
  NetworkCheckOutlined,
  PauseCircleOutlined,
  WarningAmberOutlined,
} from '@mui/icons-material'
import { Box, Chip, Divider, Grid, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { BasePage } from '@/components/base'
import { ClashInfoCard } from '@/components/home/clash-info-card'
import { ClashModeCard } from '@/components/home/clash-mode-card'
import { EnhancedCard } from '@/components/home/enhanced-card'
import { useSystemProxyState } from '@/hooks/use-system-proxy-state'
import { useSystemState } from '@/hooks/use-system-state'
import { useVerge } from '@/hooks/use-verge'

const StatusRow = ({
  label,
  value,
  active,
  unavailable = false,
}: {
  label: string
  value: string
  active?: boolean
  unavailable?: boolean
}) => (
  <Stack
    direction="row"
    sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 2 }}
  >
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Chip
      size="small"
      icon={
        unavailable ? (
          <WarningAmberOutlined />
        ) : active ? (
          <CheckCircleOutlined />
        ) : (
          <PauseCircleOutlined />
        )
      }
      label={value}
      color={unavailable ? 'warning' : active ? 'success' : 'default'}
      variant={active ? 'filled' : 'outlined'}
    />
  </Stack>
)

const StatusOverviewCard = () => {
  const { t } = useTranslation()
  const { runState, runningMode, isAdminMode, isSidecarMode } =
    useSystemState()

  const runningModeText = (() => {
    if (runningMode === 'NotRunning') {
      return t('home.components.systemInfo.badges.notRunning')
    }
    if (isAdminMode && !isSidecarMode) {
      return t('home.components.systemInfo.badges.adminServiceMode')
    }
    if (isSidecarMode) {
      return t('home.components.systemInfo.badges.sidecarMode')
    }
    return t('home.components.systemInfo.badges.serviceMode')
  })()

  return (
    <EnhancedCard
      title={t('home.components.systemInfo.title')}
      icon={<MonitorHeartOutlined />}
      iconColor="success"
    >
      <Stack spacing={1.5}>
        <StatusRow
          label={t('home.components.systemInfo.fields.runningMode')}
          value={runningModeText}
          active={runningMode !== 'NotRunning'}
        />
        <Divider />
        <StatusRow
          label="Sidecar"
          value={runState.sidecarAllowed ? 'Ready' : 'Active'}
          active={isSidecarMode}
        />
        <Divider />
        <StatusRow
          label="TUN capability"
          value={runState.tunCapable ? 'Available' : 'Unavailable'}
          active={runState.tunCapable}
          unavailable={!runState.tunCapable}
        />
      </Stack>
    </EnhancedCard>
  )
}

const NetworkStatusCard = () => {
  const { t } = useTranslation()
  const { verge } = useVerge()
  const { indicator: systemProxyEnabled } = useSystemProxyState()
  const { runState } = useSystemState()
  const tunEnabled = Boolean(verge?.enable_tun_mode && runState.tunCapable)

  return (
    <EnhancedCard
      title={t('home.page.cards.networkSettings')}
      icon={<NetworkCheckOutlined />}
      iconColor="primary"
    >
      <Stack spacing={1.5}>
        <StatusRow
          label={t('settings.sections.system.toggles.systemProxy')}
          value={
            systemProxyEnabled
              ? t('home.components.proxyTun.status.systemProxyEnabled')
              : t('home.components.proxyTun.status.systemProxyDisabled')
          }
          active={systemProxyEnabled}
        />
        <Divider />
        <StatusRow
          label={t('settings.sections.system.toggles.tunMode')}
          value={
            !runState.tunCapable
              ? t('home.components.proxyTun.status.tunModeServiceRequired')
              : tunEnabled
                ? t('home.components.proxyTun.status.tunModeEnabled')
                : t('home.components.proxyTun.status.tunModeDisabled')
          }
          active={tunEnabled}
          unavailable={!runState.tunCapable}
        />
      </Stack>
    </EnhancedCard>
  )
}

const StatusPage = () => {
  const { t } = useTranslation()

  return (
    <BasePage title={t('layout.components.navigation.tabs.status')} contentStyle={{ padding: 2 }}>
      <Grid container spacing={1.5} columns={{ xs: 6, sm: 6, md: 12 }}>
        <Grid size={6}>
          <StatusOverviewCard />
        </Grid>
        <Grid size={6}>
          <NetworkStatusCard />
        </Grid>
        <Grid size={6}>
          <ClashInfoCard />
        </Grid>
        <Grid size={6}>
          <EnhancedCard
            title={t('home.page.cards.proxyMode')}
            icon={<DeveloperBoardOutlined />}
            iconColor="warning"
          >
            <ClashModeCard />
          </EnhancedCard>
        </Grid>
      </Grid>
      <Box sx={{ height: 24 }} />
    </BasePage>
  )
}

export default StatusPage
