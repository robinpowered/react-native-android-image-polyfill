'use strict';

import React, {useEffect, useState} from 'react';
import {Image, Platform} from 'react-native';

const isAndroid = () => Platform.OS === 'android';

/**
 * An extension of the Image class which fixes an Android bug where remote images wouldn't fire the
 * Image#onError() callback when the image failed to load due to a 404 response.
 *
 * This component should only be used for loading remote images, not local resources.
 */
const ImagePolyfill = (props) => {
  const [prevSource, setPrevSource] = useState(props.source);

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
  const verifyImage = () => {
    var {uri} = props.source;
    Image.prefetch(uri).catch(e => props.onError(e));
  }
  /**
   * When the component will mount, verify the image on Android.
   * @return {void}
   */
  useEffect(() => {
    if (isAndroid() && props.onError && props.source && props.source.uri) {
      verifyImage();
    }
  }, []);

    /**
   * When the image changes on Android, verify the image.
   *
   * @param  {Object} nextProps The next incoming properties.
   * @return {void}
   */
  useEffect(() => {
    if (props.source && props.source.uri && (!prevSource || prevSource.uri !== props.source.uri) && isAndroid() && props.onError) {
      setPrevSource(props.source);
      verifyImage();
    }
  }, [props.source]);
}

ImagePolyfill.propTypes = Image.propTypes;
ImagePolyfill.defaultProps = Image.defaultProps;


export default ImagePolyfill;