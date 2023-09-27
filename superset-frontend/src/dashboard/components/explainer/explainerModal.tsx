import { t } from '@superset-ui/core';
import {
  Explainer,
  ExplainerData,
} from 'packages/superset-ui-core/src/explainer/explainer';
import { useCallback, useState } from 'react';
import Modal from 'src/components/Modal';
import Icons from 'src/components/Icons';
import IconButton from '../IconButton';
import { ExplainerSelection } from './explainerSelection';
import { ExplainerResult, ExplainerResultModal } from './explainerResult';

export interface ExplainerModalProps {
  initialChartId: number | undefined;
  isVisible: boolean;
  closeModal: () => void;
}

export const ExplainerModal = ({
  initialChartId,
  isVisible,
  closeModal,
}: ExplainerModalProps) => {
  const [resultExplainer, setResultExplainer] = useState<ExplainerResult[]>();

  const rawExplainerData = localStorage.getItem(`explainer-${initialChartId}`);
  const explainerData: ExplainerData = rawExplainerData
    ? JSON.parse(rawExplainerData)
    : null;
  const payload = explainerData ? Explainer.getPayload(explainerData) : null;

  const callExplainerApi = useCallback(() => {
    console.group('Call Explainer API ');
    if (payload) {
      console.group('Calling API Preparation');

      Explainer.execute(payload)
        .then(r => {
          console.log(`API Result : ${JSON.stringify(r.json.message)}`);
          setResultExplainer(JSON.parse(r.json.message));
        })
        .catch(e => {
          console.log(`API Error : ${JSON.stringify(e)}`);
        });
    }
    console.groupEnd();
  }, []);

  const callDownloadExplainer = useCallback(() => {
    console.log('Perform Download the Explainer JSON');
  }, []);

  return (
    <Modal
      onHide={closeModal}
      show={isVisible}
      title={t('Explainer')}
      onHandledPrimaryAction={callExplainerApi}
      primaryButtonName={t('Analyse')}
      responsive
      destroyOnClose
      bodyStyle={{
        padding: 0,
        height: 700,
      }}
    >
      <div style={{ padding: 10 }}>
        <h2>{`Overview : Chart ID ${initialChartId}`}</h2>
        <p>
          The explanation feature can try and explain what causes a region of
          measurements to have a certain value. First select the region of
          measurements you would like to explain. Then run the analysis. A list
          of potential explanations for that region of measurements will be
          loaded.
        </p>
        {/* <div>{t(`Raw Data to build Payload for Explainer : ${JSON.stringify(explainerData, null,2)}`)}</div> */}

        <br />

        <h2>Current Selection</h2>
        {payload?.targetFilter.OR ? (
          <ExplainerSelection
            data={payload.data}
            targetFilter={payload.targetFilter}
          />
        ) : (
          <p>No Data Selected</p>
        )}

        <br />

        <h2>Explanations</h2>

        {/* <div>{t(`Explainer Result : ${JSON.stringify(resultExplainer, null, 2)}`)}</div> */}

        {resultExplainer ? (
          <ExplainerResultModal results={resultExplainer} />
        ) : (
          <p>No Result</p>
        )}

        <br />

        <IconButton
          onClick={callDownloadExplainer}
          icon={<Icons.CloudDownloadOutlined iconSize="xl" />}
          label="Explainer Download"
        />
      </div>
    </Modal>
  );
};
