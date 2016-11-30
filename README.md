An Image component to polyfill Android's `onError` callback.

There are some blocking challenges with the Fresco library used for Android's images. This acts as a solution by using `Image.prefetch`, which will indicate if an image fails to resolve. Further discussion can be found in https://github.com/facebook/react-native/issues/7440#issuecomment-263740877.

# Installation

```
npm install react-native-android-image-polyfill --save
```

# Usage

```js
import Image from 'react-native-android-image-polyfill';

// Use it like a normal image

class YourComponent extends React.Component {
  render () {
    return (
      <Image
        source={{uri: 'some image'}}
        onError={() => alert('Failed!')}
      />
    );
  }
}
```
