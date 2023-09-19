import { t } from '@superset-ui/core';
import { Explainer, ExplainerData } from 'packages/superset-ui-core/src/explainer/explainer';
import { useCallback, useState } from 'react';
import Modal from 'src/components/Modal';
import IconButton from '../IconButton';
import Icons from 'src/components/Icons';

export interface ExplainerModalProps {
    initialChartId: number | undefined;
    isVisible: boolean;
    closeModal: () => void
}

export const ExplainerModal = ({
    initialChartId,
    isVisible,
    closeModal
}: ExplainerModalProps) => {

    const [resultExplainer, setResultExplainer] = useState<string>();


    const rawExplainerData = localStorage.getItem(`explainer-${initialChartId}`);
    const explainerData: ExplainerData = rawExplainerData ? JSON.parse(rawExplainerData) : null;
    const payload = explainerData ? Explainer.getPayload(explainerData) : null;

    const callExplainerApi = useCallback(() => {
        console.group("Call Explainer API ")
        if (payload) {

            console.group("Calling API Preparation")

            Explainer.execute(payload).then((r) => {
                console.log("API Result : " + JSON.stringify(r))
                setResultExplainer(JSON.stringify(r, null, 2))
            }).catch((e) => {
                console.log("API Error : " + JSON.stringify(e))
                setResultExplainer(JSON.stringify(e, null, 2))
            })

        }
        console.groupEnd();
    }, []);


    const callDownloadExplainer = useCallback(() => {
        console.log("Perform Download the Explainer JSON");
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
                height: 700
            }}
        >
            <div style={{padding:10}}>

                <h2>{t(`Overview : Chart ID ${initialChartId}`)}</h2>
                <p>
                    The explanation feature can try and explain what causes a region of
                    measurements to have a certain value. First select the region of measurements
                    you would like to explain. Then run the analysis.
                    A list of potential explanations for that region of measurements will be loaded.
                </p>
                {/* <div>{t(`Raw Data to build Payload for Explainer : ${JSON.stringify(explainerData, null,2)}`)}</div> */}

                <br />

                <h2>Current Selection</h2>
                <div>{t(`Explainer Playload : ${JSON.stringify(payload, null, 2)}`)}</div>

                <br />

                <h2>Explanations</h2>

                <div>{t(`Explainer Result : ${JSON.stringify(resultExplainer, null, 2)}`)}</div>


                <IconButton
                    onClick={callDownloadExplainer}
                    icon={<Icons.CloudDownloadOutlined iconSize="xl" />}
                    label='Explainer Download'
                ></IconButton>


            </div>


        </Modal>
    )
}   