'use strict';

import React from 'react';
import {Image, Platform} from 'react-native';

const isAndroid = () => Platform.OS === 'android';

/**
 * An extension of the Image class which fixes an Android bug where remote images wouldn't fire the
 * Image#onError() callback when the image failed to load due to a 404 response.
 *
 * This component should only be used for loading remote images, not local resources.
 */
export default class ImagePolyfill extends React.Component {
  static propTypes = Image.propTypes;
  static defaultProps = Image.defaultProps;

  /**
   * When the component will mount, verify the image on Android.
   * @return {void}
   */
  componentWillMount() {
    if (isAndroid() && this.props.onError && this.props.source && this.props.source.uri) {
      this.verifyImage();
    }
  }

  /**
   * When the image changes on Android, verify the image.
   *
   * @param  {Object} nextProps The next incoming properties.
   * @return {void}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.source && nextProps.source.uri &&
      (!this.props.source || this.props.source.uri !== nextProps.source.uri) &&
      isAndroid() &&
      nextProps.onError
    ) {
      this.verifyImage();
    }
  }

  /**
   * `Image.prefetch` is used to load the image and `catch` the failure.
   * Android's `Image` `onError` callback does not get invoked if the remote image fails to load with a `404`.
   * Prefetch, however, will reject the promise if it fails to load, allowing us to detect failures to
   * provide better fallback support.
   *
   * Android only.
   * https://github.com/facebook/react-native/issues/7440
   *
   * @return {void}
   */
  verifyImage() {
    var {uri} = this.props.source;
    Image.prefetch(uri).catch(e => this.props.onError(e));
  }

  render() {
    return <Image {...this.props} />;
  }
}
