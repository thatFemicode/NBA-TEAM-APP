FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode
);
FilePond.setOptions({
  //   stylePanelAspectRatio: 150 / 100,
  //   imageResizeTargetWidth: 100,
  //   imageResizeTargetHeight: 150,
});
FilePond.parse(document.body);

// import * as FilePond from 'filepond';
// const pond = FilePond.create({
//   multiple: true,
//   name: 'filepond',
// });

// // Add it to the DOM
// document.body.appendChild(pond.element);
