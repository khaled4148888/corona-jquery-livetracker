/*!
* Corona Virus Covid-19 Live Tracker Jquery
* Author Ian Aleck ianaleckm@gmail.com
* GitHub: https://github.com/ianaleck/corona-jquery-livetracker
* Credits: JVector & JQuery
*/
$.ajaxSetup({
  cache: false
});
(function($) {
  $.fn.coronaTracker = function(options) {
    var base_uri = 'https://corona.lmao.ninja/v2/';
    var widget = 'table';
    var defaults = {
      area: "summary",
      loop:5,
      title:"World Statistics",
      theme:"light",
      type:"table"
    };
    var settings = $.extend({}, defaults, options);
    
    var myDiv = $(this);
    if(!myDiv.hasClass("corona-wrapper")){
      myDiv.addClass("corona-wrapper");
      myDiv.addClass(settings.theme);
      myDiv.html('<div class="corona-loader"></div>');
    }
    $(window).scroll(function(e){ 
      var $el = $('.main_row'); 
      var isPositionFixed = ($el.css('position') == 'fixed');
      if ($(this).scrollTop() > 200 && !isPositionFixed){ 
        $el.css({'position': 'fixed', 'top': '10px', 'left':'30%'}); 
      }
      if ($(this).scrollTop() < 200 && isPositionFixed){
        $el.css({'position': 'static', 'top': '10px', 'left':'30%'}); 
      } 
    });
    
    var loops = [];
    
    
    // public methods 
    this.initialize = function() {
      getInfo();
      if ($.isNumeric(settings.loop)&&settings.loop>=1) {
        setInterval(function() {
          if (settings.loop>0) {
            getInfo(settings.type.toLowerCase());
          }  
        }, settings.loop * 60000);
      }else{
        settings.loop = 0;
      }
      
      
      return this;
    };
    
    function getInfo(){
      loops = [];
      var url = base_uri;
      if (settings.area.toLowerCase()=="summary") {
        url += "all";
      }else if(settings.area.toLowerCase()=="all"){
        url += "countries";
      }else if (settings.type.toLowerCase()=="map") {
        url += "countries";
      }else{
        url += "countries/"+settings.area.toLowerCase()
      }
      
      
      $.ajax({
        url: url,
        success: function(result){
          
          if (Array.isArray(result)) {
            for (var i = 0; i < result.length; i++) {
              var object = {};
              var date = new Date(result[i].updated);
              object.lastupdated =  formatDate(date);
              if (settings.type.toLowerCase()=="map") {
                object.cases = result[i].cases;
              }else{
                object.cases = result[i].cases.toLocaleString(window.document.documentElement.lang).replace(/,/g, " ");
              }
              if (result[i].todayCases>0) {
                object.todayCases = " +"+result[i].todayCases.toLocaleString(window.document.documentElement.lang).replace(/,/g, " ");
              }else{
                object.todayCases = "";
              }
              object.deaths = result[i].deaths.toLocaleString(window.document.documentElement.lang).replace(/,/g, " ");
              object.recovered = result[i].recovered.toLocaleString(window.document.documentElement.lang).replace(/,/g, " ");
              if (result[i].country!=undefined) {
                object.area = result[i].country;
                object.flag = result[i].countryInfo.flag;
                object.country = result[i].countryInfo;
              }else{
                object.area = "Summary";
                object.flag = "https://www.who.int/images/default-source/default-album/who-emblem-rgb.png?sfvrsn=39f388cd_0";
              }
              loops.push(object);
            }
            
          }else if (result !== null && typeof (result) === 'object') {
            
            var object = {};
            if (result.message!=undefined) {
              object.message = result.message;
              loops.push(object);
              settings.loop = 0;
              parseHtml();
              return;
            }
            var date = new Date(result.updated);
            object.lastupdated =  formatDate(date);
            
            if (settings.type.toLowerCase()=="map") {
              object.cases = result.cases;
            }else{
              object.cases = result.cases.toLocaleString(window.document.documentElement.lang).replace(/,/g, " ");
            }
            if (result.todayCases>0) {
              object.todayCases = " +"+result.todayCases.toLocaleString(window.document.documentElement.lang).replace(/,/g, " ");
            }else{
              object.todayCases = "";
            }
            
            object.deaths = result.deaths.toLocaleString(window.document.documentElement.lang).replace(/,/g, " ");
            object.recovered = result.recovered.toLocaleString(window.document.documentElement.lang).replace(/,/g, " ");
            if (result.country!=undefined) {
              object.area = result.country;
              object.flag = result.countryInfo.flag;
              object.country = result.countryInfo;
            }else{
              object.area = "Summary";
              object.flag = "https://www.who.int/images/default-source/default-album/who-emblem-rgb.png?sfvrsn=39f388cd_0";
            }
            loops.push(object);
          }
          if (settings.type.toLowerCase()=="map") {
            parseMap();
          }else{
            parseHtml();
          }
          
          
        },
        error:function(error){
          if (error.responseJSON!=undefined) {
            var object = {};
            if (error.responseJSON.message!=undefined) {
              object.message = error.responseJSON.message;
              loops.push(object);
              settings.loop = 0;
              parseHtml();
              return;
            }
          }
        }
      }); 
    }
    function parseHtml(){
      var loopcolor = false;
      var html = '';
      if (loops[0].message!=undefined) {
        html += '<h5>'+loops[0].message+'</h5> <br> <p>Find your country below or use "area:all or area: summary"</p><table class="w3-table-all notranslate"><tbody><tr><th>Country</th><th>ISO Code</th></tr><tr><td>SUMMARY</td><td>summary</td></tr><tr><td>ALL COUNTRIES</td><td>all</td></tr><tr><td>AFGHANISTAN</td><td>AF</td></tr><tr><td>ALBANIA</td><td>AL</td></tr><tr><td>ALGERIA</td><td>DZ</td></tr><tr><td>AMERICAN SAMOA</td><td>AS</td></tr><tr><td>ANDORRA</td><td>AD</td></tr><tr><td>ANGOLA</td><td>AO</td></tr><tr><td>ANTARCTICA</td><td>AQ</td></tr><tr><td>ANTIGUA AND BARBUDA</td><td>AG</td></tr><tr><td>ARGENTINA</td><td>AR</td></tr><tr><td>ARMENIA</td><td>AM</td></tr><tr><td>ARUBA</td><td>AW</td></tr><tr><td>AUSTRALIA</td><td>AU</td></tr><tr><td>AUSTRIA</td><td>AT</td></tr><tr><td>AZERBAIJAN</td><td>AZ</td></tr><tr><td>BAHAMAS</td><td>BS</td></tr><tr><td>BAHRAIN</td><td>BH</td></tr><tr><td>BANGLADESH</td><td>BD</td></tr><tr><td>BARBADOS</td><td>BB</td></tr><tr><td>BELARUS</td><td>BY</td></tr><tr><td>BELGIUM</td><td>BE</td></tr><tr><td>BELIZE</td><td>BZ</td></tr><tr><td>BENIN</td><td>BJ</td></tr><tr><td>BERMUDA</td><td>BM</td></tr><tr><td>BHUTAN</td><td>BT</td></tr><tr><td>BOLIVIA</td><td>BO</td></tr><tr><td>BOSNIA AND HERZEGOVINA</td><td>BA</td></tr><tr><td>BOTSWANA</td><td>BW</td></tr><tr><td>BOUVET ISLAND</td><td>BV</td></tr><tr><td>BRAZIL</td><td>BR</td></tr><tr><td>BRITISH INDIAN OCEAN TERRITORY</td><td>IO</td></tr><tr><td>BRUNEI DARUSSALAM</td><td>BN</td></tr><tr><td>BULGARIA</td><td>BG</td></tr><tr><td>BURKINA FASO</td><td>BF</td></tr><tr><td>BURUNDI</td><td>BI</td></tr><tr><td>CAMBODIA</td><td>KH</td></tr><tr><td>CAMEROON</td><td>CM</td></tr><tr><td>CANADA</td><td>CA</td></tr><tr><td>CAPE VERDE</td><td>CV</td></tr><tr><td>CAYMAN ISLANDS</td><td>KY</td></tr><tr><td>CENTRAL AFRICAN REPUBLIC</td><td>CF</td></tr><tr><td>CHAD</td><td>TD</td></tr><tr><td>CHILE</td><td>CL</td></tr><tr><td>CHINA</td><td>CN</td></tr><tr><td>CHRISTMAS ISLAND</td><td>CX</td></tr><tr><td>COCOS (KEELING) ISLANDS</td><td>CC</td></tr><tr><td>COLOMBIA</td><td>CO</td></tr><tr><td>COMOROS</td><td>KM</td></tr><tr><td>CONGO</td><td>CG</td></tr><tr><td>CONGO, THE DEMOCRATIC REPUBLIC OF THE</td><td>CD</td></tr><tr><td>COOK ISLANDS</td><td>CK</td></tr><tr><td>COSTA RICA</td><td>CR</td></tr><tr><td>CÔTE DIVOIRE</td><td>CI</td></tr><tr><td>CROATIA</td><td>HR</td></tr><tr><td>CUBA</td><td>CU</td></tr><tr><td>CYPRUS</td><td>CY</td></tr><tr><td>CZECH REPUBLIC</td><td>CZ</td></tr><tr><td>DENMARK</td><td>DK</td></tr><tr><td>DJIBOUTI</td><td>DJ</td></tr><tr><td>DOMINICA</td><td>DM</td></tr><tr><td>DOMINICAN REPUBLIC</td><td>DO</td></tr><tr><td>ECUADOR</td><td>EC</td></tr><tr><td>EGYPT</td><td>EG</td></tr><tr><td>EL SALVADOR</td><td>SV</td></tr><tr><td>EQUATORIAL GUINEA</td><td>GQ</td></tr><tr><td>ERITREA</td><td>ER</td></tr><tr><td>ESTONIA</td><td>EE</td></tr><tr><td>ETHIOPIA</td><td>ET</td></tr><tr><td>FALKLAND ISLANDS (MALVINAS)</td><td>FK</td></tr><tr><td>FAROE ISLANDS</td><td>FO</td></tr><tr><td>FIJI</td><td>FJ</td></tr><tr><td>FINLAND</td><td>FI</td></tr><tr><td>FRANCE</td><td>FR</td></tr><tr><td>FRENCH GUIANA</td><td>GF</td></tr><tr><td>FRENCH POLYNESIA</td><td>PF</td></tr><tr><td>FRENCH SOUTHERN TERRITORIES</td><td>TF</td></tr><tr><td>GABON</td><td>GA</td></tr><tr><td>GAMBIA</td><td>GM</td></tr><tr><td>GEORGIA</td><td>GE</td></tr><tr><td>GERMANY</td><td>DE</td></tr><tr><td>GHANA</td><td>GH</td></tr><tr><td>GIBRALTAR</td><td>GI</td></tr><tr><td>GREECE</td><td>GR</td></tr><tr><td>GREENLAND</td><td>GL</td></tr><tr><td>GRENADA</td><td>GD</td></tr><tr><td>GUADELOUPE</td><td>GP</td></tr><tr><td>GUAM</td><td>GU</td></tr><tr><td>GUATEMALA</td><td>GT</td></tr><tr><td>GUINEA</td><td>GN</td></tr><tr><td>GUINEA-BISSAU</td><td>GW</td></tr><tr><td>GUYANA</td><td>GY</td></tr><tr><td>HAITI</td><td>HT</td></tr><tr><td>HEARD ISLAND AND MCDONALD ISLANDS</td><td>HM</td></tr><tr><td>HONDURAS</td><td>HN</td></tr><tr><td>HONG KONG</td><td>HK</td></tr><tr><td>HUNGARY</td><td>HU</td></tr><tr><td>ICELAND</td><td>IS</td></tr><tr><td>INDIA</td><td>IN</td></tr><tr><td>INDONESIA</td><td>ID</td></tr><tr><td>IRAN, ISLAMIC REPUBLIC OF</td><td>IR</td></tr><tr><td>IRAQ</td><td>IQ</td></tr><tr><td>IRELAND</td><td>IE</td></tr><tr><td>ISRAEL</td><td>IL</td></tr><tr><td>ITALY</td><td>IT</td></tr><tr><td>JAMAICA</td><td>JM</td></tr><tr><td>JAPAN</td><td>JP</td></tr><tr><td>JORDAN</td><td>JO</td></tr><tr><td>KAZAKHSTAN</td><td>KZ</td></tr><tr><td>KENYA</td><td>KE</td></tr><tr><td>KIRIBATI</td><td>KI</td></tr><tr><td>KOREA, DEMOCRATIC PEOPLES REPUBLIC OF</td><td>KP</td></tr><tr><td>KOREA, REPUBLIC OF</td><td>KR</td></tr><tr><td>KUWAIT</td><td>KW</td></tr><tr><td>KYRGYZSTAN</td><td>KG</td></tr><tr><td>LAO PEOPLES DEMOCRATIC REPUBLIC(LAOS)</td><td>LA</td></tr><tr><td>LATVIA</td><td>LV</td></tr><tr><td>LEBANON</td><td>LB</td></tr><tr><td>LESOTHO</td><td>LS</td></tr><tr><td>LIBERIA</td><td>LR</td></tr><tr><td>LIBYAN ARAB JAMAHIRIYA</td><td>LY</td></tr><tr><td>LIECHTENSTEIN</td><td>LI</td></tr><tr><td>LITHUANIA</td><td>LT</td></tr><tr><td>LUXEMBOURG</td><td>LU</td></tr><tr><td>MACAO</td><td>MO</td></tr><tr><td>MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF</td><td>MK</td></tr><tr><td>MADAGASCAR</td><td>MG</td></tr><tr><td>MALAWI</td><td>MW</td></tr><tr><td>MALAYSIA</td><td>MY</td></tr><tr><td>MALDIVES</td><td>MV</td></tr><tr><td>MALI</td><td>ML</td></tr><tr><td>MALTA</td><td>MT</td></tr><tr><td>MARSHALL ISLANDS</td><td>MH</td></tr><tr><td>MARTINIQUE</td><td>MQ</td></tr><tr><td>MAURITANIA</td><td>MR</td></tr><tr><td>MAURITIUS</td><td>MU</td></tr><tr><td>MAYOTTE</td><td>YT</td></tr><tr><td>MEXICO</td><td>MX</td></tr><tr><td>MICRONESIA, FEDERATED STATES OF</td><td>FM</td></tr><tr><td>MOLDOVA, REPUBLIC OF</td><td>MD</td></tr><tr><td>MONACO</td><td>MC</td></tr><tr><td>MONGOLIA</td><td>MN</td></tr><tr><td>MONTENEGRO</td><td>ME</td></tr><tr><td>MONTSERRAT</td><td>MS</td></tr><tr><td>MOROCCO</td><td>MA</td></tr><tr><td>MOZAMBIQUE</td><td>MZ</td></tr><tr><td>MYANMAR</td><td>MM</td></tr><tr><td>NAMIBIA</td><td>NA</td></tr><tr><td>NAURU</td><td>NR</td></tr><tr><td>NEPAL</td><td>NP</td></tr><tr><td>NETHERLANDS</td><td>NL</td></tr><tr><td>NETHERLANDS ANTILLES</td><td>AN</td></tr><tr><td>NEW CALEDONIA</td><td>NC</td></tr><tr><td>NEW ZEALAND</td><td>NZ</td></tr><tr><td>NICARAGUA</td><td>NI</td></tr><tr><td>NIGER</td><td>NE</td></tr><tr><td>NIGERIA</td><td>NG</td></tr><tr><td>NIUE</td><td>NU</td></tr><tr><td>NORFOLK ISLAND</td><td>NF</td></tr><tr><td>NORTHERN MARIANA ISLANDS</td><td>MP</td></tr><tr><td>NORWAY</td><td>NO</td></tr><tr><td>OMAN</td><td>OM</td></tr><tr><td>PAKISTAN</td><td>PK</td></tr><tr><td>PALAU</td><td>PW</td></tr><tr><td>PALESTINIAN TERRITORY, OCCUPIED</td><td>PS</td></tr><tr><td>PANAMA</td><td>PA</td></tr><tr><td>PAPUA NEW GUINEA</td><td>PG</td></tr><tr><td>PARAGUAY</td><td>PY</td></tr><tr><td>PERU</td><td>PE</td></tr><tr><td>PHILIPPINES</td><td>PH</td></tr><tr><td>PITCAIRN</td><td>PN</td></tr><tr><td>POLAND</td><td>PL</td></tr><tr><td>PORTUGAL</td><td>PT</td></tr><tr><td>PUERTO RICO</td><td>PR</td></tr><tr><td>QATAR</td><td>QA</td></tr><tr><td>RÉUNION</td><td>RE</td></tr><tr><td>ROMANIA</td><td>RO</td></tr><tr><td>RUSSIAN FEDERATION</td><td>RU</td></tr><tr><td>RWANDA</td><td>RW</td></tr><tr><td>SAINT HELENA</td><td>SH</td></tr><tr><td>SAINT KITTS AND NEVIS</td><td>KN</td></tr><tr><td>SAINT LUCIA</td><td>LC</td></tr><tr><td>SAINT PIERRE AND MIQUELON</td><td>PM</td></tr><tr><td>SAINT VINCENT AND THE GRENADINES</td><td>VC</td></tr><tr><td>SAMOA</td><td>WS</td></tr><tr><td>SAN MARINO</td><td>SM</td></tr><tr><td>SAO TOME AND PRINCIPE</td><td>ST</td></tr><tr><td>SAUDI ARABIA</td><td>SA</td></tr><tr><td>SENEGAL</td><td>SN</td></tr><tr><td>SERBIA</td><td>RS</td></tr><tr><td>SEYCHELLES</td><td>SC</td></tr><tr><td>SIERRA LEONE</td><td>SL</td></tr><tr><td>SINGAPORE</td><td>SG</td></tr><tr><td>SLOVAKIA</td><td>SK</td></tr><tr><td>SLOVENIA</td><td>SI</td></tr><tr><td>SOLOMON ISLANDS</td><td>SB</td></tr><tr><td>SOMALIA</td><td>SO</td></tr><tr><td>SOUTH AFRICA</td><td>ZA</td></tr><tr><td>SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS</td><td>GS</td></tr><tr><td>SPAIN</td><td>ES</td></tr><tr><td>SRI LANKA</td><td>LK</td></tr><tr><td>SUDAN</td><td>SD</td></tr><tr><td>SURINAME</td><td>SR</td></tr><tr><td>SVALBARD AND JAN MAYEN</td><td>SJ</td></tr><tr><td>SWAZILAND</td><td>SZ</td></tr><tr><td>SWEDEN</td><td>SE</td></tr><tr><td>SWITZERLAND</td><td>CH</td></tr><tr><td>SYRIAN ARAB REPUBLIC</td><td>SY</td></tr><tr><td>TAIWAN</td><td>TW</td></tr><tr><td>TAJIKISTAN</td><td>TJ</td></tr><tr><td>TANZANIA, UNITED REPUBLIC OF</td><td>TZ</td></tr><tr><td>THAILAND</td><td>TH</td></tr><tr><td>TIMOR-LESTE</td><td>TL</td></tr><tr><td>TOGO</td><td>TG</td></tr><tr><td>TOKELAU</td><td>TK</td></tr><tr><td>TONGA</td><td>TO</td></tr><tr><td>TRINIDAD AND TOBAGO</td><td>TT</td></tr><tr><td>TUNISIA</td><td>TN</td></tr><tr><td>TURKEY</td><td>TR</td></tr><tr><td>TURKMENISTAN</td><td>TM</td></tr><tr><td>TURKS AND CAICOS ISLANDS</td><td>TC</td></tr><tr><td>TUVALU</td><td>TV</td></tr><tr><td>UGANDA</td><td>UG</td></tr><tr><td>UKRAINE</td><td>UA</td></tr><tr><td>UNITED ARAB EMIRATES</td><td>AE</td></tr><tr><td>UNITED KINGDOM</td><td>GB</td></tr><tr><td>UNITED STATES</td><td>US</td></tr><tr><td>UNITED STATES MINOR OUTLYING ISLANDS</td><td>UM</td></tr><tr><td>URUGUAY</td><td>UY</td></tr><tr><td>UZBEKISTAN</td><td>UZ</td></tr><tr><td>VANUATU</td><td>VU</td></tr><tr><td>VENEZUELA</td><td>VE</td></tr><tr><td>VIET NAM</td><td>VN</td></tr><tr><td>VIRGIN ISLANDS, BRITISH</td><td>VG</td></tr><tr><td>VIRGIN ISLANDS, U.S.</td><td>VI</td></tr><tr><td>WALLIS AND FUTUNA</td><td>WF</td></tr><tr><td>WESTERN SAHARA</td><td>EH</td></tr><tr><td>YEMEN</td><td>YE</td></tr><tr><td>ZAMBIA</td><td>ZM</td></tr><tr><td>ZIMBABWE</td><td>ZW</td></tr></tbody></table>';
      }else{
        html += '<div class="corona-main_table"> <div class="corona-table_row" style="margin-bottom:4px"> <div class="corona-country_column"> <div class="country_inner-corona"> '+settings.title+' </div></div><div class="corona_counter_column main_row"> <div class="corona-singlecounter_column"> <div class="corona-singlecounter_name mrb"> <strong>Cases</strong> </div></div><div class="corona-singlecounter_column "> <div class="corona-singlecounter_name mrb"> <strong>Deaths</strong> </div></div><div class="corona-singlecounter_column"> <div class="corona-singlecounter_name"> <strong>Recovered</strong> </div></div></div></div>';
        for (var i = 0; i < loops.length; i++) {
          if (i % 2 === 0) {
            var htclass = "corona-inverse"
          }else{
            var htclass = "";
          }
          html += '<div class="corona-table_row '+htclass+'"> <div class="corona-country_column"> <div class="country_inner-corona"> <figure size="20" class="ImageLoader__Container-sc-1tcx205-0 WHWEy Flag__IconContainer-sc-1hdc3hs-0 ebQKyC"><img src="'+loops[i].flag+'" class="Flag__IconComponentImg-sc-1hdc3hs-1 cydrYC"></figure> <span>'+loops[i].area+'</span> </div></div><div class="corona_counter_column "> <div class="corona-singlecounter_column"> <div class="corona-singlecounter_light_name cases"> <div>'+loops[i].cases+'</div><div></div></div></div><div class="corona-singlecounter_column"> <div class="corona-singlecounter_light_name deaths"> <div>'+loops[i].deaths+'</div><div></div></div></div><div class="corona-singlecounter_column"> <div class="corona-singlecounter_light_name recovered"> <div>'+loops[i].recovered+'</div><div></div></div></div></div></div>';
        }
        html += '</div><div class="corona_main_footer" style="display:block !important"> Updated:&nbsp; <time datetime="'+loops[0].lastupdated+'" title="'+loops[0].lastupdated+'" class="DateTime__Time-sc-13gi7wj-0 ccFqVo">'+loops[0].lastupdated+'</time> <br>Data from: World Health Organization (WHO)</div>';
      }
      myDiv.html(html);
      
    }
    function hsl_col_perc(percent, start, end) {
      var a = percent / 100,
      b = (end - start) * a,
      c = b + start;
      
      // Return a CSS HSL string
      return 'hsl('+c+', 100%, 50%)';
    }
    function parseMap(){
      settings.loop = 0;
      var countryValues = {};
      for (var cpos = 0; cpos < loops.length; cpos++) {
        countryValues[loops[cpos].country.iso2] = loops[cpos].cases!=undefined?loops[cpos].cases:"No Data";
      }
      
      
      myDiv.html("");
      myDiv.vectorMap({
        map: 'world_mill_en',
        series: {
          regions: [{
            values: countryValues,
            scale: [ '#eec096','#3f0000'],
            normalizeFunction: 'polynomial'
          }]
        },onRegionTipShow: function(e, el, code){
          el.html(el.html()+' Confirmed Cases - '+countryValues[code]);
        }
      });
    }
    function formatDate(date) {
      var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      hour = d.getHours(),
      mins = d.getMinutes();
      if (mins<10) {
        mins = "0"+mins;
      }
      if (month.length < 2) 
      month = '0' + month;
      if (day.length < 2) 
      day = '0' + day;
      
      return [year, month, day].join('-')+" "+hour+":"+mins+" Hrs";
    }
    
    return this;
  }
})(jQuery);