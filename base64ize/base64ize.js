/*
 * base64ize binary-to-base64 convertor
 * Copyright (c) 2010 a2h
 * http://github.com/a2h/js
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * Under section 7b of the GNU Affero General Public License you are
 * required to preserve this notice.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

var flashSound;

soundManager.onload = function() {
	flashSound = soundManager.createSound('flashSound','flash.mp3');
}

$(document).ready(function() {
	$("#area")
		.bind('dragenter', dragenter)
		.bind('dragleave', dragleave)
		.bind('dragover', dragover);
	
	// if jquery.fn.bind is used for this event this preventDefault() won't work unless it's executed first
	document.getElementById('area').addEventListener("drop", drop, true);
});

function dragenter(e)
{
	$("#area").addClass('enter');
}

function dragleave(e)
{
	$("#area").removeClass('enter');
}

function dragover(e)
{
	e.preventDefault();
}

function drop(e)
{
	var dt = e.dataTransfer;
	var files = dt.files;
	
	e.preventDefault();
	
	if (files.length == 1)
	{
		flashSound.play();
		$("#flash").show();
		
		handleFile(files[0]);
	}
	else
	{
		alert('Sorry, but only one file at a time is supported right now');
	}
	
	$("#flash").fadeOut(250);
}

function handleFile(file)
{
	var reader = new FileReader();
	reader.onloadend = function() {
		$("#result").text(reader.result).show();
	}
	reader.readAsDataURL(file);
}