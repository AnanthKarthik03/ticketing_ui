import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
  selector: 'app-setting-sidebar',
  templateUrl: './setting-sidebar.component.html',
  styleUrls: ['./setting-sidebar.component.css']
})
export class SettingSidebarComponent implements OnInit {
  userName: any;
  userProfile = '';
  roleId='';
  constructor(public router: Router, public routers: ActivatedRoute) { }
  pageType = '';
  imagePath = environment.employee_logo;

  ngOnInit() {
    this.pageType = this.routers.snapshot.url[0].path;
    this.userProfile = sessionStorage.getItem('user_image');

    this.userName = sessionStorage.getItem('name');
    this.roleId = sessionStorage.getItem('role');
    $(document).ready(function () {
      'use strict';
      const DIV_CARD = 'div.card';
      setTimeout(function () {
        $('.page-loader-wrapper').fadeOut();
      }, 50);
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="popover"]').popover({ html: true });
      $('[data-toggle="card-remove"]').on('click', function (e) {
        const $card = $(this).closest(DIV_CARD);
        $card.remove();
        e.preventDefault();
        return false;
      });
      $('[data-toggle="card-collapse"]').on('click', function (e) {
        const $card = $(this).closest(DIV_CARD);
        $card.toggleClass('card-collapsed');
        e.preventDefault();
        return false;
      });
      $('[data-toggle="card-fullscreen"]').on('click', function (e) {
        const $card = $(this).closest(DIV_CARD);
        $card.toggleClass('card-fullscreen').removeClass('card-collapsed');
        e.preventDefault();
        return false;
      });
      // if ($('[data-sparkline]').length) {
      //   const generateSparkline = function ($elem, data, params) {
      //     $elem.sparkline(data, {
      //       type: $elem.attr('data-sparkline-type'),
      //       height: '100%',
      //       barColor: params.color,
      //       lineColor: params.color,
      //       fillColor: 'transparent',
      //       spotColor: params.color,
      //       spotRadius: 0,
      //       lineWidth: 2,
      //       highlightColor: hexToRgba(params.color, 0.6),
      //       highlightLineColor: '#666',
      //       defaultPixelsPerValue: 5,
      //     });
      //   };

      // }
      if ($('.chart-circle').length) {
        $('.chart-circle').each(function () {
          const $this = $(this);
          $this.circleProgress({
            fill: { color: 'indigo' },
            size: $this.height(),
            startAngle: (-Math.PI / 4) * 2,
            emptyFill: '#F4F4F4',
            lineCap: 'round',
          });
        });
      }
      $('.accordion2 > .accordion-item.is-active')
        .children('.accordion-panel')
        .slideDown();
      $('.accordion2 > .accordion-item').on('click', function () {
        $(this)
          .siblings('.accordion-item')
          .removeClass('is-active')
          .children('.accordion-panel')
          .slideUp();
        $(this)
          .toggleClass('is-active')
          .children('.accordion-panel')
          .slideToggle('ease-out');
      });
      $('.bh_income').sparkline('html', {
        type: 'bar',
        height: '30px',
        barColor: '#1A5089',
        barWidth: 5,
      });
      $('.bh_traffic').sparkline('html', {
        type: 'bar',
        height: '30px',
        barColor: '#E21E32',
        barWidth: 5,
      });
    });
    $(document).ready(function () {
      $('.star').on('click', function () {
        $(this).toggleClass('star-checked');
      });
      $('.ckbox label').on('click', function () {
        $(this).parents('tr').toggleClass('selected');
      });
      $('.btn-filter').on('click', function () {
        const $target = $(this).data('target');
        if ($target !== 'all') {
          $('.table tr').css('display', 'none');
          $('.table tr[data-status="' + $target + '"]').fadeIn('slow');
        } else {
          $('.table tr').css('display', 'none').fadeIn('slow');
        }
      });
    });
    $(document).ready(function () {
      'use strict';
      $('.sidebar-nav').metisMenu();
      $('.menu_toggle').on('click', function () {
        $('body').toggleClass('offcanvas-active');
      });
      $('.chat_list_btn').on('click', function () {
        $('.chat_list').toggleClass('open');
      });
      $('.menu_option').on('click', function () {
        $('.metismenu').toggleClass('grid');
        $('.menu_option').toggleClass('active');
      });
      $('.user_btn').on('click', function () {
        $('.user_div').toggleClass('open');
      });
      $('a.settingbar').on('click', function () {
        $('.right_sidebar').toggleClass('open');
      });
      $('a.theme_btn').on('click', function () {
        $('.theme_div').toggleClass('open');
      });
      $('.page').on('click', function () {
        $('.theme_div, .right_sidebar').removeClass('open');
        $('.user_div').removeClass('open');
      });
      $('.theme_switch').on('click', function () {
        $('body').toggleClass('theme-dark');
      });
    });
    $(document).ready(function () {
      'use strict';
      $('.arrow_option input:radio').click(function () {
        const others = $('[name=\'' + this.name + '\']')
          .map(function () {
            return this.value;
          })
          .get()
          .join(' ');
        // console.log(others)
        $('.metismenu .has-arrow').removeClass(others).addClass(this.value);
      });
      $('.list_option input:radio').click(function () {
        const others = $('[name=\'' + this.name + '\']')
          .map(function () {
            return this.value;
          })
          .get()
          .join(' ');
        // console.log(others)
        $('.metismenu li .collapse a').removeClass(others).addClass(this.value);
      });
      $('.font_setting input:radio').click(function () {
        const others = $('[name=\'' + this.name + '\']')
          .map(function () {
            return this.value;
          })
          .get()
          .join(' ');
        console.log(others);
        $('body').removeClass(others).addClass(this.value);
      });
    });
    $(document).ready(function () {
      'use strict';
      $('.setting_switch .btn-darkmode').on('change', function () {
        if (this.checked) {
          $('body').addClass('dark-mode');
        } else {
          $('body').removeClass('dark-mode');
        }
      });
      $('.setting_switch .btn-fixnavbar').on('change', function () {
        if (this.checked) {
          $('#page_top').addClass('sticky-top');
        } else {
          $('#page_top').removeClass('sticky-top');
        }
      });
      $('.setting_switch .btn-iconcolor').on('change', function () {
        if (this.checked) {
          $('body').addClass('iconcolor');
        } else {
          $('body').removeClass('iconcolor');
        }
      });
      $('.setting_switch .btn-gradient').on('change', function () {
        if (this.checked) {
          $('body').addClass('gradient');
        } else {
          $('body').removeClass('gradient');
        }
      });
      $('.setting_switch .btn-sidebar').on('change', function () {
        if (this.checked) {
          $('body').addClass('sidebar_dark');
        } else {
          $('body').removeClass('sidebar_dark');
        }
      });
      $('.setting_switch .btn-min_sidebar').on('change', function () {
        if (this.checked) {
          $('#header_top').addClass('dark');
        } else {
          $('#header_top').removeClass('dark');
        }
      });
      $('.setting_switch .btn-pageheader').on('change', function () {
        if (this.checked) {
          $('#page_top').addClass('top_dark');
        } else {
          $('#page_top').removeClass('top_dark');
        }
      });
      $('.setting_switch .btn-boxshadow').on('change', function () {
        if (this.checked) {
          $('.card, .btn, .progress').addClass('box_shadow');
        } else {
          $('.card, .btn, .progress').removeClass('box_shadow');
        }
      });
      $('.setting_switch .btn-rtl').on('change', function () {
        if (this.checked) {
          $('body').addClass('rtl');
        } else {
          $('body').removeClass('rtl');
        }
      });
      $('.setting_switch .btn-boxlayout').on('change', function () {
        if (this.checked) {
          $('body').addClass('boxlayout');
        } else {
          $('body').removeClass('boxlayout');
        }
      });
    });
    // $(document).ready(function () {
    //   'use strict';
    //   const options = { valueNames: ['name', 'born'] };
    //   const userList = new List('users', options);
    // });
    function setStyleSheet(url) {
      const stylesheet = document.getElementById('theme_stylesheet');
      stylesheet.setAttribute('href', url);
    }
    $(window)
      .bind('resize', function () {
        // console.log($(this).width())
        if ($(this).width() < 1201) {
          $('.horizontal').removeClass('h_menu');
        } else {
          $('.horizontal').addClass('h_menu');
        }
      })
      .trigger('resize');
  }
  Dashboard() {
    this.router.navigate(['/Dashboard']);
  }
  role() {
    this.router.navigate(['/role']);
  }

  state() {
    this.router.navigate(['/state']);
  }
  country() {
    this.router.navigate(['/country']);
  }
  designation() {
    this.router.navigate(['/designation']);
  }
  department() {
    this.router.navigate(['/department']);
  }
  category(){
    this.router.navigate(['/category']);
  }
  Other(){
    this.router.navigate(['/Other']);
  }
}
