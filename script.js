jQuery(document).ready(function($) {

  var drop_items = $('.dnd-onto-website').find('.drop');

  //get user agent, test for IE, if show display warning
  var userAgent = window.navigator.userAgent;
  if (userAgent.indexOf('MSIE') != -1) {
    $('.ie-message').show();
  }

  //set up event listeners for the drop item
  function setUpEventListeners() {
    drop_items.each(function() {
      var thisDrop = $(this);

      thisDrop[0].addEventListener('dragenter', dragEnter);
      thisDrop[0].addEventListener('dragover', dragOver);
      thisDrop[0].addEventListener('dragleave', dragLeave);
      thisDrop[0].addEventListener('drop', drop);

    });

  }
  setUpEventListeners();

  //called as the draggable enters a droppable 
  //needs to return false to make droppable area valid
  function dragEnter(event) {

    var drop = this;
    $(drop).addClass('drop-active');
    event.preventDefault();

  }

  //called continually while the draggable is over a droppable 
  //needs to return false to make droppable area valid
  function dragOver(event) {

    var drop = this;
    $(drop).addClass('drop-active');
    event.preventDefault();
  }

  //called when the draggable was inside a droppable but then left
  function dragLeave(event) {

    var drop = this;
    $(drop).removeClass('drop-active');
  }

  //called when draggable is dropped on droppable 
  //final process, used to copy data or update UI on successful drop
  function drop(event) {

    event.stopPropagation();
    event.preventDefault();

    //main drop container
    drop = $(this);

    //remove class from drop zone
    drop.removeClass('drop-active');

    var dataList, dataText, dataType;

    //get the URL of elements being dragged here
    try {
      dataValue = event.dataTransfer.getData('text/uri-list');
      dataType = 'text/uri-list';
    } catch (e) {
      dataValue = event.dataTransfer.getData('URL');
      dataType = 'URL';
    }

    //if we have a URL passed
    if (dataValue) {

      var messageContainer = $('.message-container');
      messageContainer.empty();
      messageContainer.addClass('active');
      messageContainer.append('<p>Your dropped element from an external window. It has this data<p>');
      drop.empty();

      //if we have access to the URI list
      if (dataType == 'text/uri-list') {
        messageContainer.append('<ul><li><strong>Text/URI-List: </strong>' + dataValue + '</li></ul>');
      }
      //only have access to the older URL value (IE)
      if (dataType == 'URL') {
        messageContainer.append('You must be on Internet Explorer, it only supports \'\text\'\ or \'\URL\'\ types');
        messageContainer.append('<ul><li><strong>URL: </strong>' + dataValue + '</li></ul>');
      }

      //determine if our URL is an image
      imageDropped = false;
      var imageExtensions = ['.jpg', '.jpeg', '.png', '.bmp', '.gif'];
      for (i = 0; i < imageExtensions.length; i++) {
        if (dataValue.indexOf(imageExtensions[i]) !== -1) {

          //create our image from the URL of the drop
          var image = '<img src="' + dataValue + '">';
          drop.append(image);
          imageDropped = true;
          break;
        }
      }

      //if we dropped an image, notify user
      if (imageDropped == true) {
        messageContainer.append('<p><strong>Successfully dropped from an online source</strong></p>');
      } else {
        messageContainer.append('<p><strong>Couldn\'\t determine what was dropped, it didn\'\t match expected image formats</strong></p>');
      }

    }
    //if we have a list of files
    else {

      //check if any files were dropped (from the desktop etc)
      var dataFiles = event.dataTransfer.files;
      var dataOutput = [];
      if (dataFiles) {
        var messageContainer = $('.message-container');
        messageContainer.empty();
        messageContainer.addClass('active');
        messageContainer.append('<p>You dropped an item / items from your desktop. Here is its data<p>');
        drop.empty();

        for (i = 0; i < dataFiles.length; i++) {

          var dataItem = dataFiles[i];
          var dataType = dataFiles[i].type;

          //check if this is an image
          if (dataType.match('image.*')) {

            var dataLastModified = dataFiles[i].lastModified;
            var dataLastModifiedDate = dataFiles[i].lastModifiedDate;
            var dataName = dataFiles[i].name;
            var dataSize = dataFiles[i].size;
            var dataType = dataFiles[i].type;

            messageContainer.append('<ul>');
            messageContainer.append('<li><strong>Name</strong>:' + dataName + '</li>');
            messageContainer.append('<li><strong>Data Size</strong>:' + dataSize + '</li>');
            messageContainer.append('<li><strong>Data Type</strong>:' + dataType + '</li>');
            messageContainer.append('</ul>');

            //read into memory
            var reader = new FileReader();

            //when our image is loaded
            reader.onload = (function(theFile) {
              return function(e) {
                var url = e.target.result;

                drop.append('<img src="' + url + '" title="' + dataName + '"/>');
                messageContainer.append('<p><strong>Successfully dropped an image from your desktop</strong></p>');
              };
            })(dataItem);

            //load element
            reader.readAsDataURL(dataItem);
          } else {
            messageContainer.append('<p><strong>It looks like you have not dropped an image. Only images are allowed </strong></p>');
          }
        }
      }

    }

  }

});