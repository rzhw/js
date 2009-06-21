/*
	Imagegalleyr 1.0.0 b2 dev version
	Copyright 2009 a2h - http://a2h.uni.cc/

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
	
	Imagegalleyr depends on both Prototype and Scriptaculous.
	
	For documentation see http://a2h.uni.cc/
*/

// current image
var imgglyrCur = 0;

// number of images
var imgglyrNum = 0;
var imgglyrNum2 = 0;

var imgglyrCaptionsExist = true;

document.observe('dom:loaded', function() {
	// check if captions are set
	if (typeof(imgglyrCaptions) == "undefined")
	{
		imgglyrCaptionsExist = false;
	}

	// stop doing things if arrays aren't same size
	if (imgglyrCaptionsExist)
	{
		if (imgglyrImages.length != imgglyrCaptions.length)
		{
			$("imgglyr_global").update("You have optional image settings set, but they do not have the same amount of items as the URL array. Script exiting.");
			imgglyrStop();
		}
	}
	
	imgglyrNum = imgglyrImages.length;
	imgglyrNum2 = imgglyrNum -= 1;

	// make the global container look like one
	$("imgglyr_global").setStyle({
		"background": imgglyrBg,
		"width": imgglyrImgWdh+"px"
	});
	
	if (imgglyrShwBrd)
	{
		$("imgglyr_global").setStyle({
			"padding": "6px"
		});
	}
	
	// fill in the global container with this
	var glyrcont = '';
	glyrcont += '<div id="imgglyr_imgs" style="overflow:hidden;"></div>';
	if (imgglyrShwBrd)
	{
		glyrcont += '<table cellpadding="0" cellspacing="0" border="0" style="margin-top:3px;"><tr><td id="imgglyr_tabs"></td><td id="imgglyr_name" style="text-align:right;"></td></tr></table>';
	}
	$("imgglyr_global").update(glyrcont);
	
	// set image container size
	$("imgglyr_imgs").setStyle({
		"width": imgglyrImgWdh+"px",
		"height": imgglyrImgHgt+"px"
	});
	
	if (imgglyrShwBrd)
	{
		// set tab container size
		$("imgglyr_tabs").setStyle({
			"width": (imgglyrImgWdh/2)+"px"
		});
		
		// set name container size and font
		$("imgglyr_name").setStyle({
			"width": (imgglyrImgWdh/2-8)+"px",
			"color": imgglyrFg,
			"font": imgglyrFntSiz + " " + imgglyrFntFmy
		});
	}

	for (i=0;i<=imgglyrNum;i++)
	{
		if (imgglyrShwBrd)
		{
			// create all the tabs
			$("imgglyr_tabs").insert({ bottom: '<div id="imgglyr_tab_'+i+'" style="font-size:0px;">&nbsp;</div>&nbsp;' });
			$("imgglyr_tab_"+i).setStyle({
				"background": imgglyrTabOffBg,
				"display": "inline",
				"padding": (imgglyrTabHgt*(3/4)) + "px 0px " + (imgglyrTabHgt*(1/4)) + "px " + imgglyrTabWdh+"px"
			});
		}
		
		// create all the images
		$("imgglyr_imgs").insert({ bottom: '<div id="imgglyr_img_'+i+'" style="position:absolute;margin-top:0px;"></div>' });
		$("imgglyr_img_"+i).setStyle({
			"width": imgglyrImgWdh+"px",
			"height": imgglyrImgHgt+"px",
			"background": 'url("' + imgglyrImages[i] + '")'
		});
		
		// hide the image at first
		new Effect.Opacity("imgglyr_img_"+i, { from: 1.0, to: 0.0, duration: 0.0 });
	}
	
	// first image udpate
	imgglyrUpdateImg(true);
	
	// non first image update
	setInterval(function() {
		imgglyrUpdateImg(false);
	}, imgglyrFadeDly*1000);
});

function imgglyrUpdateImg(isfirst)
{
	// remove highlight from orig tab
	if (imgglyrShwBrd)
	{
		$("imgglyr_tab_"+imgglyrCur).setStyle({
			"background": imgglyrTabOffBg
		});
	}

	// hide orig image
	new Effect.Opacity("imgglyr_img_"+imgglyrCur, { from: 1.0, to: 0.0, duration: imgglyrFadeDur });

	// is it the first load?
	if (!isfirst)
	{
		imgglyrCur += 1;
	}
	
	// did we reach the end of the list?
	if (imgglyrCur > imgglyrNum2)
	{
		imgglyrCur = 0;
	}
	
	// show image
	new Effect.Opacity("imgglyr_img_"+imgglyrCur, { from: 0.0, to: 1.0, duration: imgglyrFadeDur });
	
	if (imgglyrShwBrd)
	{
		// add highlight to tab
		$("imgglyr_tab_"+imgglyrCur).setStyle({
			"background": imgglyrTabOnBg
		});
	
		// change caption
		if (imgglyrCaptionsExist)
		{
			$("imgglyr_name").update(imgglyrCaptions[imgglyrCur]);
		}
	}
}

function imgglyrStop()
{
	// Self explanatory.
	$("sfjkldfkljsdlfj").sdjfklsdjklsjfklsdjfklj("crashme","crashme");
}