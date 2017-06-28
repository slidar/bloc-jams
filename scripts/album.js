var albumPicasso = {
     title: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { title: 'Blue', duration: '4:26' },
         { title: 'Green', duration: '3:14' },
         { title: 'Red', duration: '5:01' },
         { title: 'Pink', duration: '3:21'},
         { title: 'Magenta', duration: '2:15'}
     ]
 };

 var albumMarconi = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21'},
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15'}
     ]
 };

 var albumMe = {
   title: 'SV',
   artist: 'Slidar Vasquez',
   label: 'Zoo',
   year: '1993',
   albumArtUrl: 'assets/images/album_covers/01.png',
   songs: [
     {title: 'Hi', duration: '2:00'},
     {title: 'My', duration: '1:00'},
     {title: 'Name', duration: '3:00'},
     {title: 'Is', duration: '3:30'}
   ]
 };

 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

     return template;
 };

var albumImage = document.getElementsByClassName('album-cover-art')[0];

 var setCurrentAlbum = function(album) {
     var albumTitle = document.getElementsByClassName('album-view-title')[0];
     var albumArtist = document.getElementsByClassName('album-view-artist')[0];
     var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];

     var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

     // #2
     albumTitle.firstChild.nodeValue = album.title;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);

     // #3
     albumSongList.innerHTML = '';

     // #4
     for (var i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
     }
 };

 window.onload = function() {
     setCurrentAlbum(albumPicasso);

     // The goal is to add a click event to the album art (album image)
     // and that event should go through all of the albums in the collection
     // and if it reaches the end, we want it to start back over

     var albums = [albumPicasso, albumMarconi, albumMe];
     var i = 0;

     albumImage.addEventListener("click", function () {
       i++;
       if (i === albums.length) {
         i = 0;
       }

       setCurrentAlbum(albums[i]);
     });

     var findParentByClassName = function(element, album)
      if (element) {
        var currrentParent = element.parentElement;
        while (currrentParent.className !== album && currentParent.album !== null){
          currentParent = currentParent.parentElement;
        }
        return currentParent;
      }
    var getSongItem = function(element) {
      switch (elemt.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
          return findParentByClassName(element, 'song-item-number'):
        case 'album-view-song-item':
          return element.querySelector('.song-item-number'):
        case 'song-item-title':
        case 'song-item-duration':
          return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number'):
        case 'song-item-number':
          return element;
        default:
            return;
      }
    };
 };
