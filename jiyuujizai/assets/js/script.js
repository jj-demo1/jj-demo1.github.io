


/**
 * 環境設定情報
 */
const $cfg = {
  'root': {
    'update': ''
    ,'scrollBehavior': "false"
  }
  ,
  'navbar': {
    'selector': '#jj-navbar'
    ,'collapseSelector': '#jj-navbarCollapse'
    ,'useFixed': "false"
    ,'minWidth': 300
  }
};


/**
 * 設定情報
 */
const $setting = {
	'location_hash': null
	// ナビバー要素のセレクター
	,'navbar_selector': null
	// ナビバー(.navbar.collapse)要素のセレクター
	,'navbar_collapseSelector': null
	// ページ上端からナビバー要素までの距離
	,'navbar_topPosition': 0
	// ナビバー要素の高さ
	,'navbar_height': 0

	,'scrollBehavior': null
	,'isDarkMode': false

};



jQuery(function() {

	// <meta>要素 設定値取得
  let cfg_meta = jj_get_cfg_meta();

  // ターゲットのキーをループして設定値更新
  Object.keys(cfg_meta).forEach(key => {
    if (typeof($cfg[key]) !== "undefined") {
      for (key2 in cfg_meta[key]) {
        if (typeof($cfg[key][key2]) !== "undefined") {
          $cfg[key][key2] = cfg_meta[key][key2];
        }
      }
    }
  });

//console.log( $cfg );
//return false;

  // navbar リンク強調
  //jj_navbarLinkActive($cfg.navbarLinkActive);

  // ナビバー セレクター存在確認
  //$setting.is_navbar = $($cfg.navbar.selector).length > 0 ? true : false;
  //$setting.is_navbar_collapse = $($cfg.navbar.collapseSelector).length > 0 ? true : false;

  // ナビバー セレクター 設定
	if ($($cfg.navbar.selector).length > 0) {
		$setting.navbar_selector = $cfg.navbar.selector;
	}
  // ナビバー セレクター(.navbar-collapse) 設定
	if ($($cfg.navbar.collapseSelector).length > 0) {
		$setting.navbar_collapseSelector = $cfg.navbar.collapseSelector;
	}

  // ナビバー セレクターが存在しない場合は処理中断
	if ( ! $setting.navbar_selector) return false;


	//$setting.navbar = {
	//	'offset_top': $($setting.navbar_selector).offset().top
	//	,'height': $($setting.navbar_selector).outerHeight()
		//,'show_height': 0
	//};

	// ページ上端からナビバー要素までの距離を取得
	$setting.navbar_topPosition = $($setting.navbar_selector).offset().top;

	// ナビバー要素の高さを取得
	$setting.navbar_height = $($setting.navbar_selector).outerHeight();

  // hash値 取得
  if (location.hash) {
    $setting.location_hash = location.hash;
  }

	// スクロール(縦)の位置を取得
	$setting.windowY = window.scrollY;

	// システムのダークモード設定を取得
	//if (window.matchMedia('(prefers-color-scheme: dark)').matches == true) {
	//	$setting.isDarkMode = true;
	//}


  // 指定のポジションへスクロール
  jj_positionScroll($setting.location_hash);

	// ナビバー 固定化
	jj_navbarFixed($setting);

	// scroll-behavior 無効化
	//$('html').css('scrollBehavior', "auto");
	//$('html').css('scrollBehavior', "unset");
	//$('html').css('scrollBehavior', "smooth");

	// true=["smooth"|"true"] false=その他
	if ($cfg.root.scrollBehavior) {
		switch ($cfg.root.scrollBehavior) {
			case "smooth": $setting.scrollBehavior = ""; break;
			case "true": $setting.scrollBehavior = ""; break;
			case "auto": $setting.scrollBehavior = "auto"; break;
			default: $setting.scrollBehavior = "unset"; break;
		}
	}

	if ($setting.scrollBehavior) {
		$('html').css('scrollBehavior', $setting.scrollBehavior);
	}

//console.log( $('html').css('scrollBehavior') );



// テーマ
jj_themeToggle();



	// アンカーリンク クリック
	$('a[href^="#"]').click(function(){
		jj_positionScroll($(this).attr("href"));
	});


	// window スクロール
	$(window).scroll(function() {
		// スクロール(Y)座標を取得
		$setting.windowY = window.scrollY;

		// ナビバー 固定化
		jj_navbarFixed();

		// スクロール領域調整
		//jj_scrollPadding($setting);
	});


	// windows サイズ変更
	$(window).resize(function() {

//console.log( $('.collapse').css('display') );

//if ($('.collapse').css('display') == "none") {
//	console.log( "sp " + $('.collapse').css('display'));
//} else {
//	console.log( "pc " + $('.collapse').css('display'));
//}

		// スクロール領域調整
		//jj_scrollPadding($setting);
	});


  // ナビバー リンクをクリック
  $($setting.navbar_selector).on('click', function() {
    // ナビバーメニューを閉じる
    jj_navbarClose();
  });

  // ページトップへもどる
  $(".page-top").on("click", function () {
		/*
    location.href = '#';
    // navbar リンク強調
    navbarLinkActive($cfg.navbarLinkActive, null);
    // ナビバーメニューを閉じる
    jj_navbarClose();
		*/

		// TOPポジションへスクロール
		jj_positionScroll('#');

    // ナビバーメニューを閉じる
    jj_navbarClose();
  });


  /*
  // ターゲットとなるBootstrap5のnavbar-collapse要素を指定
  // 開ききった後のイベント
  $setting.navbar.collapseSelector.on('shown.bs.collapse', function () {
    console.log('Navbarが開きました');
    //$setting.navbar.show_height = $($setting.navbar_selector).outerHeight();
    //set_navbar_height();
  });

  // 閉じきった後のイベント
  $setting.navbar.collapseSelector.on('hidden.bs.collapse', function () {
    //console.log('Navbarが閉じました');
    //$setting.navbar.show_height = $($setting.navbar_selector).outerHeight();
  });
  */

console.log( $cfg );
console.log( $setting );

});


/**
 * テーマ設定
 */
function jj_themeToggle(_mode = "auto") {
	let isDarkMode = null;

	if (_mode == "auto") {
		// システムのダークモード設定を取得
		isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
	}

  const htmlTag = document.documentElement;

  // 現在のテーマを取得
  const currentTheme = htmlTag.getAttribute('data-bs-theme');

	// 適用するテーマ
  const newTheme = isDarkMode === true ? 'dark' : 'light';

  if (currentTheme != newTheme) {
    htmlTag.setAttribute('data-bs-theme', newTheme);
  }
}


/**
 * 閉じているナビバーの高さを計測する
 * .navbar-collapse
 * (一時的にナビバー(Bootstrap)スタイルを強制して高さを測る)
 * @return number ret
 */
function jj_navbarCollapseShowHeight() {
  let ret = 0;

  if ($($setting.navbar_collapseSelector).length > 0) {
    // ナビバー(Bootstrap)の表示クラスを追加
    $($setting.navbar_collapseSelector).addClass('show');
    // ナビバーの高さを取得
    //ret = $($cfg.navbar.collapseSelector).closest('.navbar').outerHeight();
    //ret = $($cfg.navbar.collapseSelector).outerHeight();
    ret = $($setting.navbar_collapseSelector).height();
    // ナビバー(Bootstrap)の表示クラスを削除
    $($setting.navbar_collapseSelector).removeClass('show');
  }

  return ret;
}




/**
 * スマホ幅 判定
 * @return boolean true:スマホ幅の場合 fale:スマホ幅以外の場
 */
function isSpWidth() {

//console.log( 'window.innerWidth=' + window.innerWidth + '; .collapse-display=' + $('.navbar-collapse').css('display'));

// collapseSelector
  //if (window.innerWidth < 992) {
  //if ($('.navbar-collapse').css('display') == "block") {
  if ($($setting.navbar_collapseSelector).css('display') == "block") {
    return true;
  }

	return false;
}


/**
 * ナビバー固定判定
 * 現在のナビバーの状態が固定か非固定か判定する
 *
 * return boolean true=固定 false=非固定
 */
function isNavbarFixed() {
	if ($($setting.navbar_selector).css('position') == "fixed") {
		return true;
	}

	return false;
}


/**
 * 設定データ取得
 */
function jj_get_cfg_meta() {
  let config = {};
  let meta = $('meta[itemprop^="jj:"]');

  if (meta.length > 0) {
    let name = "", property = null, content = null, datas = null, res = null;
    for (let i = 0; i < meta.length; ++i) {
      name = "";
      if ((property = $(meta[i]).attr('itemprop')) && (res = property.match('(^[^\:]+):(.*)'))) {
        if (res[2]) {
          name = res[2];
        }
      }

      if (! name) {
        continue;
      }

      config[name] = {};

      // content="*" 値あり
      if ((content = $(meta[i]).attr('content'))) {
        datas = JSON.parse(content);
        for (let key in datas) {
          config[name][key] = datas[key];
        }
      }

      // data-* 値あり
      datas = $(meta[i]).data();
      if (Object.keys(datas).length == 0) {
        continue;
      }
      for (let key in datas) {
        config[name][key] = datas[key];
      }
    }
  }

  return config;
}



/**
 * 指定の位置(#ID)へスクロール
 * @param string _id 例:#works
 */
function jj_positionScroll(_id = null) {
	if ( ! _id) return false;

	let position = null;


let _scroll = false;

if ($setting.scrollBbehavior) {
	_scroll = true;
}

  // ハッシュ(#)だけの場合は 0 のポジション
	if (_id == "#") {
		position = 0;
	}
  // 要素が実際に存在するか確認
  else if ($(_id).length) {
    // 要素の画面上部からの座標(px)を取得
    position = $(_id).offset().top;

//console.log("座標: " + targetPosition + "px");

    // 固定ナビバーの高さ分を調整
    if ($setting.navbar_height > 0) {
      position -= $setting.navbar_height;
    }

//console.log("座標: " + position + "px");

  }

//console.log('position=' + position);


		let navbarCollapseShowHeight = 0;
		// スマホ幅＆ナビバー非固定位置の場合
		if (isSpWidth() == true && isNavbarFixed() == false) {
			navbarCollapseShowHeight = jj_navbarCollapseShowHeight();
		}


	if (_scroll) {
console.log('scroll');
  // 取得した座標へスクロール
  if (position >= 0) {
		/*
		// スマホ幅＆ナビバー非固定位置の場合
		if (isSpWidth() == true && isNavbarFixed() == false) {
			position -= jj_navbarCollapseShowHeight();
		}
		*/

		position -= navbarCollapseShowHeight;

		// スクロールの速度
		let speed = _scroll == true ? 300 : 0;

		jj_positionScrollExecute(position, speed);

	}

//console.log( 'scrollPaddingTop=' + $('html').css('scrollPaddingTop') );

}
}


/**
 * 指定の位置(#ID)へスクロール実行
 * @param number _position 例:0
 */
function jj_positionScrollExecute(_position = null, _speed = 300) {
  // 数値型以外は続行しない
	if (typeof(_position) != "number") return false;

  // 取得した座標へスクロール
  if (_position >= 0) {
    $('html, body').animate({scrollTop: _position}, _speed, function(){
    
console.log("スクロール終了");

    });
	}

}


/**
 * ナビバー 固定化
 */
function jj_navbarFixed() {
  if ($cfg.navbar.useFixed !== "true") return false;

  if (($cfg.navbar.minWidth == 0 || ($cfg.navbar.minWidth > 0 && $($setting.navbar_selector).outerWidth() > $cfg.navbar.minWidth)) && $setting.windowY > $setting.navbar_topPosition) {
    $($setting.navbar_selector).addClass('fixed-top');
    $($setting.navbar_selector).parent().css('marginTop', $setting.navbar_height);
  } else {
    $($setting.navbar_selector).removeClass('fixed-top');
    $($setting.navbar_selector).parent().css('marginTop', 0);
  }
}


/**
 * ナビバー メニューを閉じる
 */
function jj_navbarClose() {
	let selector = null;

	if ($($cfg.navbar.collapseSelector).length > 0) {
		selector = $($setting.navbar_collapseSelector);
	} else if ($('.navbar-collapse').length) {
		selector = $('.navbar-collapse');
	}

  // ナビバーメニューを閉じる
  if (selector && $(selector).length > 0) {
    selector.collapse('hide');
  }
}









/**
 * ナビバー リンク強調
 */
/*
function jj_navbarLinkActive(_vars) {
  // リンクをクリック
  $(_vars.selector).on('click', function() {
    navbarLinkActive(_vars, this);
    // ナビバーメニューを閉じる
    jj_navbarClose();
  });
}
*/

/**
 * ナビバー リンク強調
 */
/*
function navbarLinkActive(_vars, _this = null) {
  if (_vars.use !== true) return false;

  // hash値 取得
  let hash = location.hash ? location.hash : (_vars.home_path ? _vars.home_path : '');

  // classを初期化
  $(_vars.selector).each(function() {
    if (_vars.init_class) {
      $(this).attr('class', _vars.init_class);
    }
  });
  if (_this) {
    // classを追加する
    if (_vars.active_class) {
      $(_this).addClass(_vars.active_class);
    }
  } else {
    // アドレスバーのhashと同期
    if (hash && _vars.active_class) {
      let own = $($('[href="' + hash + '"]'), _vars.selector);
      if (own) {
        $(own).addClass(_vars.active_class);
      }
    }
  }
}
*/







/**
 * スマホ幅ナビバー非固定 判定
 * @return boolean true:スマホ幅かつナビバー非固定位置の場合 fale:その他
 */
/*
function isSpTop() {

//console.log( 'is-fixed=' + $('#jj-navbar').css('position') );
//console.log( isNavbarFixed() );

  if (window.innerWidth < 992) {
    //if ((0 <= $setting.windowY && $setting.windowY <= $setting.navbar.offset_top)) {
    if (isNavbarFixed() == false) {
      return true;
    }
  }

	return false;
}
*/

/*
function navbarFixed(_vars) {
  if (_vars.useFixed !== true) return false;

  let navbar = $(_vars.selector),
      offset = navbar.offset(),
      navbar_h = navbar.outerHeight();

  $(window).scroll(function() {
    let navbar_w = navbar.outerWidth();
    if ((_vars.min_width == 0 || (_vars.min_width > 0 && navbar_w > _vars.min_width)) && $(window).scrollTop() > offset.top) {
      $(navbar).addClass('fixed-top');
      $(navbar).parent().css('marginTop', navbar_h);
    } else {
      $(navbar).removeClass('fixed-top');
      $(navbar).parent().css('marginTop', 0);
    }
  });
}
*/

/**
 * スクロール時の領域オフセット
 * (ナビバー(Bootstrap) スクロールズレ対策)
 */
/*
function jj_scrollPadding(_setting) {
  let windowWidth = window.innerWidth;

	//let _windows_min_width = 992;

	let paddingTop = 0;



	// ナビバー コンテンツのグループ化がON(画面幅が指定値以下)
  if (windowWidth < 992)
  {
    if ((0 <= _setting.windowY && _setting.windowY <= $setting.navbar.offset_top)) {
//      $('html').css('scrollPaddingTop', "280px");

//console.log( 'jj_navbarShowHeight()=' + jj_navbarShowHeight());
      //if ($setting.navbar.show_height == 0) {

        $setting.navbar.show_height = jj_navbarShowHeight();
        //paddingTop = jj_navbarShowHeight();
//console.log ('$setting.navbar.show_height=' + $setting.navbar.show_height);

      //}

console.log('show_height = ' + $setting.navbar.show_height);

      if ($setting.navbar.show_height > 0) {
        //$('html').css('scrollPaddingTop', $setting.navbar.show_height + "px");
        paddingTop = $setting.navbar.show_height;
      } else {
        //$('html').css('scrollPaddingTop', "280px");
        paddingTop = 280;
      }
      
      //paddingTop = 280;
    }
    else
    {
      //$('html').css('scrollPaddingTop', _setting.navbar.offset_top + "px");
      paddingTop = $setting.navbar.offset_top;
    }
  }
  // ナビバー コンテンツのグループ化がOFF(画面幅が指定値より大きい)
  else
  {
    //$('html').css('scrollPaddingTop', _setting.navbar.offset_top + "px");
    paddingTop = $setting.navbar.offset_top;
  }
paddingTop = 280;
	//if (paddingTop > 0) {
	if (paddingTop > 0 && $setting.navbar.show_height != paddingTop) {
		$setting.navbar.show_height = paddingTop;
		$('html').css('scrollPaddingTop', paddingTop + "px");
	}

console.log( "paddingTop=" + paddingTop + '; $setting.navbar.show_height=' + $setting.navbar.show_height);
}
*/


/*
function jj_scrollPadding(_setting) {
  let windowWidth = window.innerWidth;

	// ナビバー コンテンツをグループ化 ON(画面幅が指定値以下)
  if (windowWidth < 992)
  {
    if ((0 <= _setting.windowY && _setting.windowY <= _setting.navbar.offset_top)) {
//      $('html').css('scrollPaddingTop', "280px");

			//if (_setting.navbar.show_height == 0) {
			//	_setting.navbar.show_height = jj_navbarShowHeight();
			//}

      if ($setting.navbar.show_height == 0) {
        $setting.navbar.show_height = jj_navbarShowHeight();
      }

//console.log('show_height = ' + $setting.navbar.show_height);

      if ($setting.navbar.show_height > 0) {
        $('html').css('scrollPaddingTop', $setting.navbar.show_height + "px");
      } else {
        $('html').css('scrollPaddingTop', "280px");
      }
    }
    else
    {
      $('html').css('scrollPaddingTop', _setting.navbar.offset_top + "px");
    }
  }
  // ナビバー コンテンツをグループ化 OFF(画面幅が指定値以下)
  else
  {
    $('html').css('scrollPaddingTop', _setting.navbar.offset_top + "px");
  }
}
*/


/**
 * 閉じているナビバーの高さを計測する
 * .navbar
 * (一時的にナビバー(Bootstrap)スタイルを強制して高さを測る)
 * @return number ret
 */
/*
function jj_navbarShowHeight() {
  let ret = 0;

  if ($cfg.navbar.collapse_selector.length > 0) {
    // ナビバー(Bootstrap)の表示クラスを追加
    $($cfg.navbar.collapse_selector).addClass('show');
    // ナビバーの高さを取得
    ret = $($cfg.navbar.collapse_selector).closest('.navbar').outerHeight();
    // ナビバー(Bootstrap)の表示クラスを削除
    $($cfg.navbar.collapse_selector).removeClass('show');
  }

  return ret;
}
*/
