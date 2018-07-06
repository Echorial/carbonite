window.CarbonDoc = {
	getArticle: function (name) {
		for (var i in this.data.articles) {
			var a = this.data.articles[i];
			if (a.type == "class")
				if (a.route == name)
					return a;
		}
	},
	getItem: function (name) {
		for (var i in this.data.items) {
			var item = this.data.items[i];
			if (item.type == "page")
				if (item.name.replace(/[\r\n]/g, "") == name)
					return item;
		}
	},
	procDoc: function (body) {
		return body.replace(/@note ([^\n]*)/g, "<div class='doc-note'>$1</div>").replace(/@warn ([^\n]*)/g, "<div class='doc-warn'>$1</div>");
	},
	findArticles: function (name) {
		var rtn = [];
		for (var a of this.data.articles)
			if (a.type == "class")
				if (a.route.search(name) != -1)
					rtn.push(a);
		return rtn;
	},
	loadArticle: function (name) {
		var a = this.getArticle(name);

		if (!a)
			return false;

		var mid = document.getElementById("doc-mid");
		var r = `
		<div class='doc-class'>
			<h2>
				${a.route.split(".").slice(0, -1).join(".")}.<label>${a.name}</label>
			</h2>
			${a.doc != "" ? "<div class='doc-body'>" + this.procDoc(a.doc) + "</div>" : ""}
		</div>
		`;

		for (var member of a.members) {
			var args = [];
			if (member.type == "method")
				for (var arg of member.arguments)
					args.push(`
						<div style="margin: .8em 2em;">
							<a href="#${arg.type.match(/(<.*>)?(.*)/)[2]}">${arg.type.replace(/</g, "&lt;")}</a>
							<label>${arg.name}</label>
						</div>
					`);

			r += `<div class="doc-member">
				<a href="#${member.output.match(/(<.*>)?(.*)/)[2]}">${member.output.replace(/</g, "&lt;")}</a>
				<label>${member.name}${member.type == "method" ? " (" + args.join("") + ")" : ""}</label>
				${member.doc != "" ? "<br><br><div class='doc-body'>" + this.procDoc(member.doc) + "</div>" : ""}
			</div>`;
		}

		mid.innerHTML = r;

		return true;
	},
	loadPage: function (name) {
		let item = this.getItem(name);

		var mid = document.getElementById("doc-mid");

		mid.innerHTML = item.data;
	},
	addLink: function (nav, label, url) {
		var link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("class", "link");
		link.innerText = label;

		nav.appendChild(link);
	},
	addSearch: function (e, uid, place, call) {
		var that = this;
		var s = document.createElement("input");
		s.setAttribute("type", "text");
		s.setAttribute("class", "doc-search");
		s.setAttribute("placeholder", place);
		s.setAttribute("id", uid);

		function fill(elem, d) {
			var fills = [];
			for (var i in d) {
				fills.push("<a href='" + d[i] + "'>" + i + "</a>");
			}
			elem.innerHTML = fills.join("");
			if (Object.keys(d).length * 35 > window.innerHeight)
				elem.setAttribute("style", "left: " + s.offsetLeft + "px; top: " + (s.offsetTop + 45) + "px; width: " + s.offsetWidth + "px; height: " + (window.innerHeight - (s.offsetTop + 45)) + "px; overflow: scroll;");
		}

		s.onkeyup = function () {
			var list = call(s, s.value);
			if (list) {
				var drop = document.getElementById("drop-" + uid);
				if (!drop) {
					drop = document.createElement("div");
					drop.setAttribute("class", "doc-drop");
					drop.setAttribute("id", "drop-" + uid);
					drop.setAttribute("style", "left: " + s.offsetLeft + "px; top: " + (s.offsetTop + 45) + "px; width: " + s.offsetWidth + "px;");
					document.body.appendChild(drop);
				}
				fill(drop, list);
			}else{
				var drop = document.getElementById("drop-" + uid);
				if (drop)
					document.body.removeChild(drop);
			}
		};

		s.onblur = function () {
			setTimeout(function () {
				var drop = document.getElementById("drop-" + uid);
				if (drop)
					document.body.removeChild(drop);
			}, 200);
		};

		window.onhashchange = function () {
			that.change();
		};

		e.appendChild(s);
	},
	change: function () {
		var f = window.location.href.match(/#(.*)/g);
		if (f && f.length > 0)
			if (!this.loadArticle(f[0].substr(1)))
				this.loadPage(f[0].substr(1));
	},
	load: function (data) {
		var that = this;
		this.data = data;

		var nav = document.createElement("div");
		nav.setAttribute("id", "doc-nav");
		nav.setAttribute("class", "doc-nav");
		
		var sideBar = document.createElement("div");
		sideBar.setAttribute("id", "doc-side");
		sideBar.setAttribute("class", "doc-side");

		var mid = document.createElement("div");
		mid.setAttribute("id", "doc-mid");
		mid.setAttribute("class", "doc-mid");

		document.body.appendChild(nav);
		document.body.appendChild(sideBar);
		document.body.appendChild(mid);

		this.addLink(nav, "Home", "#home");

		this.addSearch(nav, "mainSearch", "search", function (e, text) {
			var found = that.findArticles(text);
			var out = {};

			for (var a of found)
				out[a.route] = "#" + a.route;

			return out;
		});

		that.change();
	}
};