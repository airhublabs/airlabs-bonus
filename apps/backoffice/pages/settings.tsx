import { Button, CircularProgress, Container, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, {
  FC,
  Reducer,
  useEffect,
  useReducer,
  useState,
  type Reducer as ReducerType,
} from 'react';
import api from '../lib/api/airlabs.api';
import { useListDangerZones } from '../lib/api/zones/zones.query';
import PageHeader from '../lib/components/header/PageHeader';
import { useAlerts } from '../lib/hooks/useAlerts';
import ListTextField from '../lib/views/settings/ListTextField';
import { useSnackbar } from 'notistack';

interface ZoneActionData {
  zone: string;
  id: number;
  isNew: boolean;
}

const Settings = (props) => {
  const [dangerZones, setDangerZones] = useState<ZoneActionData[]>([]);
  const alerts = useAlerts();
  const { enqueueSnackbar } = useSnackbar();

  const dangerZonesQuery = useListDangerZones({
    onSuccess: (dangerZoness) => {
      setDangerZones(
        dangerZoness.map((dangerZone) => ({
          id: dangerZone.id,
          zone: dangerZone.zone,
          isNew: false,
        }))
      );
    },
  });

  const randomId = () => {
    return Math.floor(Math.random() * 10000 + 1);
  };

  const addNewDangerZone = () => {
    setDangerZones((zones) => [...zones, { id: randomId(), zone: '', isNew: true }]);
  };

  const deleteDangerZone = async (zoneId: number) => {
    setDangerZones((_zone) => _zone.filter((dangerZone) => dangerZone.id !== zoneId));
    try {
      const response = await api.dangerZones.delete(zoneId);
    } catch (error) {
      console.error(error);
    }
  };

  const updateDangerZone = (zoneId: number, data: Partial<ZoneActionData>) => {
    setDangerZones((zones) =>
      zones.map((zone) => {
        if (zone.id === zoneId) {
          return { ...zone, ...data };
        }
        return zone;
      })
    );
  };

  const handleDangerZoneInputBlur = async ({ zone, id, isNew }: ZoneActionData) => {
    if (!zone) return deleteDangerZone(id);

    if (isNew) {
      try {
        const response = await api.dangerZones.create({ zone });
        updateDangerZone(id, { isNew: false, id: response.data.id, zone: response.data.zone });

        console.log(response);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await api.dangerZones.update(id, { zone });

        console.log(response);
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (dangerZonesQuery.isLoading) return <CircularProgress />;

  return (
    <>
      <Container maxWidth="md" sx={{ padding: 'var(--space-sm)' }}>
        <header>
          <Typography variant="h1">Settings</Typography>
          <Button onClick={() => enqueueSnackbar('Hello', {title: "testing"})}>Add Alert</Button>
        </header>

        <section className="settings">
          <Stack gap="var(--space-sm)">
            <Stack>
              <Typography variant="h3">Danger zones</Typography>
              <Typography variant="body1">Edit danger zones that apply bonuses</Typography>
            </Stack>

            <Stack gap="var(--space-xs)">
              {dangerZones.map((zone) => (
                <ListTextField
                  value={zone.zone}
                  key={zone.id}
                  onBlur={(value) =>
                    handleDangerZoneInputBlur({ zone: value, id: zone.id, isNew: zone.isNew })
                  }
                  onDelete={() => deleteDangerZone(zone.id)}
                />
              ))}

              <Button variant="outlined" onClick={addNewDangerZone}>
                Add Zone
              </Button>
            </Stack>
          </Stack>
        </section>
      </Container>

      <style jsx>{`
        .settings {
          padding: var(--space-md) 0;
        }
      `}</style>
    </>
  );
};

export default Settings;
