/**
 * Multi Audio Tracks Plugin for Videogular v1.0.0 http://videogular.com
 * v0.0.1
 * Copyright (c) 2015 ArtKuz https://github.com/ArtKuz
  * Licensed under the MIT license.
 */
/**
 * @ngdoc directive
 * @name ru.artkuz.videogular.direcitve:vgMultiAudio
 * @restrict E
 */
'use strict';
angular.module('ru.artkuz.videogular.plugins.multiaudio', [])
    .directive(
    'vgMultiAudio',
    [function() {
        return {
            restrict: 'E',
            require: '^videogular',
            scope: {
                multiAudio: '=vgMultiAudioConfig'
            },
            link: function(scope, elem, attr, API) {
                if (scope.multiAudio.sources !== undefined && scope.multiAudio.sources.length > 0) {
                    var rootTag                = angular.element(document).find('vg-multi-audio'),
                        multiAudioTracks       = scope.multiAudio.sources,
                        multiAudioTracksLength = multiAudioTracks.length,
                        audio                  = new Audio(),
                        idPrefix               = 'multiAudioTrack';

                        scope.currentTime      = 0;
                        scope.timeLeft         = 0;
                        scope.totalTime        = 0;
                        scope.isLive = false;

                    if (scope.multiAudio.idPrefix !== undefined && scope.multiAudio.idPrefix.length > 0 && scope.multiAudio.idPrefix.length !== ' ') {
                        idPrefix = scope.multiAudio.idPrefix;
                    }

                    scope.addAudio = function changeSource(id, src, type) {
                        return "<audio id='" + idPrefix + i + "'><source src='" + multiAudioTracks[i][j].src + "' type='" + multiAudioTracks[i][j].type + "'/></audio>";
                    };

                    scope.audioTrack = function audioTrack() {
                        return document.getElementById(idPrefix + '0');
                    };

                    scope.onUpdateTime = function onUpdateTime(videoTime) {
                        scope.currentTime = videoTime;

                        if (scope.audioTrack().duration != Infinity) {
                            scope.timeLeft    = scope.audioTrack().duration * scope.currentTime;
                            scope.totalTime   = 1000 * scope.audioTrack().duration;
                            scope.isLive = false;
                        }
                        else {
                            scope.isLive = true;
                        }
                    };

                    scope.setCurrentTime = function setCurrentTime() {
                        return scope.audioTrack().currentTime = API.currentTime / 1000;
                    };

                    scope.onSetVolume = function onSetVolume(newVolume) {
                        scope.audioTrack().volume = newVolume;
                    };

                    scope.onPlay = function onPlay() {
                        scope.setCurrentTime();
                        scope.audioTrack().play();
                        API.play();
                    };

                    scope.onPause = function onPause() {
                        scope.audioTrack().pause();
                        API.pause();
                    };

                    scope.onClickPlayPause = function onClickPlayPause(state) {
                        if (state === 'play') {
                            scope.onPlay();
                        } else {
                            scope.onPause();
                        }
                    };

                    for (var i = 0; i < multiAudioTracksLength; i++) {
                        for (var j = 0, l = multiAudioTracks[i].length; j < l; j++) {
                            var canPlay = '';

                            if(!!audio.canPlayType) {
                                canPlay = audio.canPlayType(multiAudioTracks[i][j].type);

                                if (canPlay === "maybe" || canPlay === "probably") {
                                    rootTag.append(scope.addAudio(i, multiAudioTracks[i][j].src, multiAudioTracks[i][j].type));
                                    break;
                                }
                            } else {
                                rootTag.append(scope.addAudio(i, multiAudioTracks[i][0].src, multiAudioTracks[i][0].type));
                            }
                        }
                    }

                    scope.$watch(
                        function () {
                            return API.currentTime;
                        },
                        function (newVal, oldVal) {
                            scope.onUpdateTime(newVal);
                        }
                    );

                    scope.$watch(
                        function () {
                            return API.currentState;
                        },
                        function (newVal, oldVal) {
                            if (newVal != oldVal) {
                                scope.onClickPlayPause(newVal);
                            }
                        }
                    );

                    scope.$watch(
                        function () {
                            return API.volume;
                        },
                        function (newVal, oldVal) {
                            if (newVal != oldVal) {
                                scope.onSetVolume(newVal);
                            }
                        }
                    );
                } else {
                    console.warn('The configuration file is missing multiAudio.sources. Module videogular-multi-audio do not work now!');
                }
            }
        };
    }]);