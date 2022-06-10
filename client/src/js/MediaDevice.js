import _ from 'lodash';
import { videoParams } from '../const';
import Emitter from './Emitter';

/**
 * Manage all media devices
 */
class MediaDevice extends Emitter {
  /**
   * Start media devices and send stream
   */
  start() {
    const constraints = {
      video: {
        facingMode: 'user',
        height: { min: 360, ideal: 720, max: 1080 }
      },
      audio: true
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        this.stream = stream;
        this.emit('stream', stream);
      })
      .catch((err) => {
        if (err instanceof DOMException) {
          alert('Cannot open webcam and/or microphone');
        } else {
          console.log(err);
        }
      });

    return this;
  }

  /**
   * Turn on/off a device
   * @param {'Audio' | 'Video'} type - Type of the device
   * @param {Boolean} [on] - State of the device
   */
  toggle(type, on) {
    const len = arguments.length;
    if (this.stream) {
      this.stream[`get${type}Tracks`]().forEach((track) => {
        const state = len === 2 ? on : !track.enabled;
        _.set(track, 'enabled', state);
      });
    }
    return this;
  }
  setConstructor(constraints) {
    const v = constraints.video;
    this.stream.getVideoTracks()[0].applyConstraints({
      frameRate: {
        ideal: v.minFrameRate,
        max: v.maxFrameRate,
      },
      width: {
        ideal: v.minWidth,
        max: v.maxWidth,
      },
      height: {
        ideal: v.minHeight,
        max: v.maxHeight,
      }
    });

    return this;
  }
  toggleShare() {
    navigator.mediaDevices
      .getDisplayMedia({
        video: {
          minWidth: 1400,
          minHeight: 800,
          cursor: 'always',
          minFrameRate: 60,
        },
        audio: true
      })
      .then((stream) => {
        this.stream = stream;
        this.emit('newstream', stream);
      })
    return this;
  }
  /**
   * Stop all media track of devices
   */
  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
    return this;
  }
}

export default MediaDevice;
