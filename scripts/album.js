var setSong = function(songNumber) {
    if (currentSoundFile) {
       currentSoundFile.stop();
   }

    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true
    });
    setVolume(currentVolume);
  };

var seek = function(time) {
       if (currentSoundFile) {
           currentSoundFile.setTime(time);
       }
   }

var setVolume = function(volume) {
      if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
       }
 };

var getSongNumberCell = function(number){
  return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

     var $row = $(template);

     var clickHandler = function() {

            var songNumber = $(this).attr('data-song-number');
            var songNumber = parseInt($(this).attr('data-song-number'));


            if(currentlyPlayingSongNumber !== null) {
                  var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
                  currentlyPlayingCell.html(currentlyPlayingSongNumber);
            }

            if (currentlyPlayingSongNumber !== songNumber) {
              setSong(songNumber);
              currentSoundFile.play();
              updateSeekBarWhileSongPlays();
              currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

              var $volumeFill = $('.volume .fill');
              var $volumeThumb = $('.volume .thumb');
              $volumeFill.width(currentVolume + '%');
              $volumeThumb.css({left: currentVolume + '%'});

              $(this).html(pauseButtonTemplate);
              updatePlayerBarSong();

            } else if (currentlyPlayingSongNumber === songNumber) {
                if (currentSoundFile.isPaused()) {
                    $(this).html(pauseButtonTemplate);
                    $('.main-controls .play-pause').html(playerBarPauseButton);
                    currentSoundFile.play();
                } else {
                     $(this).html(playButtonTemplate);
                     $('.main-controls .play-pause').html(playerBarPlayButton);
                     currentSoundFile.pause();
                     currentlyPlayingSongNumber = null;
            }
          }
};

     var onHover = function(event) {

          var songNumberCell = $(this).find('.song-item-number');
          var songNumber = parseInt(songNumberCell.attr('data-song-number'));

          if (songNumber !== currentlyPlayingSongNumber){

            songNumberCell.html(playButtonTemplate);
        }
    };

     var offHover = function(event) {

          var songNumberCell = $(this).find('.song-item-number');
          var songNumber = parseInt(songNumberCell.attr('data-song-number'));

          if (songNumber !== currentlyPlayingSongNumber){
           songNumberCell.html(songNumber);
         }
         console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);

     };

     $row.find('.song-item-number').click(clickHandler);

     $row.hover(onHover, offHover);

     return $row;
 };

var setCurrentAlbum = function(album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

     $albumSongList.empty();

     for (var i = 0; i < album.songs.length; i++) {
          var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
          $albumSongList.append($newRow);
     }
 };

var updateSeekBarWhileSongPlays = function() {
      if (currentSoundFile) {
          currentSoundFile.bind('timeupdate', function(event) {
              var seekBarFillRatio = this.getTime() / this.getDuration();
              var $seekBar = $('.seek-control .seek-bar');

              updateSeekPercentage($seekBar, seekBarFillRatio);
          });
      }
  };

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
     var offsetXPercent = seekBarFillRatio * 100;

     offsetXPercent = Math.max(0, offsetXPercent);
     offsetXPercent = Math.min(100, offsetXPercent);

     var percentageString = offsetXPercent + '%';
     $seekBar.find('.fill').width(percentageString);
     $seekBar.find('.thumb').css({left: percentageString});
  };

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;

        if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }

          updateSeekPercentage($(this), seekBarFillRatio);
       });

       $seekBars.find('.thumb').mousedown(function(event) {

           var $seekBar = $(this).parent();

           $(document).bind('mousemove.thumb', function(event){
               var offsetX = event.pageX - $seekBar.offset().left;
               var barWidth = $seekBar.width();
               var seekBarFillRatio = offsetX / barWidth;

               if ($seekBar.parent().attr('class') == 'seek-control') {
                   seek(seekBarFillRatio * currentSoundFile.getDuration());
               } else {
                   setVolume(seekBarFillRatio);
               }

               updateSeekPercentage($seekBar, seekBarFillRatio);
           });
         });
       }

 var trackIndex = function(album, song) {
      return album.songs.indexOf(song);
  };

var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    var lastSongNumber = currentlyPlayingSongNumber;

    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSoundFile.play();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    updatePlayerBarSong;

    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;

    if (currentSongIndex < 0) {
      currentSongIndex = currentAlbum.songs.length - 1;
    }
    var lastSongNumber = currentlyPlayingSongNumber;

    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSoundFile.play();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    updatePlayerBarSong;

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

 var updatePlayerBarSong = function() {

     $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
     $('.main-controls .play-pause').html(playerBarPauseButton);
     $('.current-time').text(currentTime);
     $('.total-time').text(totalTime);

 };

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';


var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    // attach the event to the play/pause button in the playerbar here
    $('.main-controls .play-pause').click(togglePlayFromPlayerBar);
});

function togglePlayFromPlayerBar() {

  if (currentSoundFile) {
    // 1. If a song is paused
    if (currentSoundFile.isPaused()) {
      // - Change the song number cell from a play button to a pause button
      var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
      $previousSongNumberCell.html(pauseButtonTemplate);

      // - Change the HTML of the player bar's play button to a pause button
      $('.main-controls .play-pause').html(playerBarPauseButton);

      // - Play the song
      currentSoundFile.play();

    // 2. If the song is playing
    } else {
      // - Change the song number cell from a pause button to a play button
        var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
        $previousSongNumberCell.html(playButtonTemplate);

      // - Change the HTML of the player bar's pause button to a play button
      $('.main-controls .play-pause').html(playerBarPlayButton);


      // - Pause the song

      currentSoundFile.pause();
    }
  }
}

function filterTimeCode (timeInSeconds) {
  // get the seconds in number form (using parseFloat)
  // whole seconds and whole minutes calculated
  // return a string in the X:XX format that the time in seconds is equal to
  // example: timeInSeconds = 121.3, return "2:01"
  // is the minutes is less than 10, we need to find a way to make the number padded, for example: 121 would turn into "2:1"

  var minutes = Math.floor(parseFloat(timeInSeconds) / 60);
  var seconds = timeInSeconds - (minutes * 60);

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return minutes + ":" + seconds;
}

function setCurrentTimeInPlayerBar(currentTime) {
  // set the text of the element with the .curent-time class to the current time in the song
  $('.current-time').text(currentTime);
}


function setTotalTimeInPlayerBar(totalTime) {
  // set the text of the element with the .total-time class to the length of the song
  $('.total-time').text(totalTime);
}
