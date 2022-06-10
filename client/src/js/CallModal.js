import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Camera, Phone, Microphone } from 'akar-icons';

function CallModal({ status, callFrom, startCall, rejectCall }) {
  const acceptWithVideo = (video) => {
    const config = { audio: true, video };
    return () => startCall(false, callFrom, config);
  };

  return (
    <div className={classnames('call-modal', status)}>
      <p>
        <span className="caller">{`${callFrom} is calling`}</span>
      </p>
      <button
        type="button"
        className="btn-action"
        onClick={acceptWithVideo(true)}
      >
        <Camera strokeWidth={2} size={24} />
      </button>
      <button
        type="button"
        className="btn-action"
        onClick={acceptWithVideo(false)}
      >
        <Microphone strokeWidth={2} size={24} />
      </button>
      <button
        type="button"
        className="btn-action hangup"
        onClick={rejectCall}
      >
        <Phone strokeWidth={2} size={24} />
      </button>
    </div>
  );
}

CallModal.propTypes = {
  status: PropTypes.string.isRequired,
  callFrom: PropTypes.string.isRequired,
  startCall: PropTypes.func.isRequired,
  rejectCall: PropTypes.func.isRequired
};

export default CallModal;
