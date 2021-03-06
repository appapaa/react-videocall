/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { AirplayVideo, Camera, Gear, Phone, Microphone } from 'akar-icons';
import { defVideoParams } from '../const';

const getButtonClass = (icon, enabled) => classnames(`btn-action ${icon ? 'fa' : ''} ${icon}`, { disable: !enabled });

function CallWindow({ peerSrc, localSrc, config, mediaDevice, status, endCall }) {
  const peerVideo = useRef(null);
  const shareVideo = useRef(null);
  const localVideo = useRef(null);
  const [video, setVideo] = useState(config.video);
  const [audio, setAudio] = useState(config.audio);
  const [share, setShare] = useState(config.share);
  const [params, setParams] = useState(defVideoParams);
  const [visible, showModal] = useState(false);
  const videoTracks = peerSrc && peerSrc.getVideoTracks();
  let MediaStream2 = null;
  if (videoTracks && videoTracks[1]) {
    MediaStream2 = new MediaStream([videoTracks[1]]);
  }
  useEffect(() => {
    if (peerVideo.current && peerSrc) peerVideo.current.srcObject = peerSrc;
    if (shareVideo.current && MediaStream2) shareVideo.current.srcObject = MediaStream2;
    if (localVideo.current && localSrc) localVideo.current.srcObject = localSrc;
  });

  useEffect(() => {
    if (mediaDevice && !share) {
      mediaDevice.toggle('Video', video);
      mediaDevice.toggle('Audio', audio);
    }
  });

  /**
   * Turn on/off a media device
   * @param {'Audio' | 'Video'} deviceType - Type of the device eg: Video, Audio
   */
  const toggleMediaDevice = (deviceType) => {
    if (deviceType === 'Share') {
      setShare(!share);
      return !share && mediaDevice.toggleShare({ video: params, audio });
    }
    if (deviceType === 'Video') {
      setVideo(!video);
    }
    if (deviceType === 'Audio') {
      setAudio(!audio);
    }
    mediaDevice.toggle(deviceType);
  };

  return (
    <div className={classnames('call-window', status)}>
      <video id="peerVideo" ref={peerVideo} autoPlay />
      <video id="shareVideo" ref={shareVideo} autoPlay controls />
      <video id="localVideo" ref={localVideo} autoPlay muted />
      <div className="video-control">
        <button
          key="btnShare"
          title='?????????????????? ??????????????'
          type="button"
          className='btn-action'
          onClick={() => {
            showModal(!visible);
            mediaDevice.setConstructor({ video: params, audio });
          }}
        >
          <Gear strokeWidth={2} size={24} />
        </button>
        <button
          key="btnShare"
          title='????????????'
          type="button"
          className={getButtonClass('', share)}
          onClick={() => toggleMediaDevice('Share')}
        >
          <AirplayVideo strokeWidth={2} size={24} />
        </button>
        <button
          key="btnVideo"
          title='??????????'
          type="button"
          className={getButtonClass('', video)}
          onClick={() => toggleMediaDevice('Video')}
        >
          <Camera strokeWidth={2} size={24} />
        </button>
        <button
          key="btnAudio"
          title='??????????'
          type="button"
          className={getButtonClass('', audio)}
          onClick={() => toggleMediaDevice('Audio')}
        >
          <Microphone strokeWidth={2} size={24} />
        </button>
        <button
          type="button"
          title='??????????????????'
          className="btn-action hangup"
          onClick={() => endCall(true)}
        >
          <Phone strokeWidth={2} size={24} />
        </button>
      </div>
      <div className={'settings-modal' + (visible ? ' -visible' : '')}>
        {_.map(params, (v, key) => <div key={key} className='settings-modal-item'>
          <span>{key}</span>
          <input value={v} onChange={({ target: { value } }) =>
            setParams({ ...params, [key]: +value })} />
        </div>)}
      </div>
    </div >
  );
}

CallWindow.propTypes = {
  status: PropTypes.string.isRequired,
  localSrc: PropTypes.object, // eslint-disable-line
  peerSrc: PropTypes.object, // eslint-disable-line
  config: PropTypes.shape({
    audio: PropTypes.bool.isRequired,
    video: PropTypes.bool.isRequired
  }).isRequired,
  mediaDevice: PropTypes.object, // eslint-disable-line
  endCall: PropTypes.func.isRequired
};

export default CallWindow;
