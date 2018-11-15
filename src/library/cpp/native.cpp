#include <string>
#include <vector>
#include <map>
#include <memory>
#include <iostream>
#include <variant>

#ifndef _C_NATIVE_TOOLS

#define _C_NATIVE_TOOLS

struct _c_primitive;
using _c_r_vec = std::vector<_c_primitive>;
using _c_r_map = std::map<std::string, _c_primitive>;
using _c_map = std::unique_ptr<_c_r_map>;
using _c_vec = std::unique_ptr<_c_r_vec>;
using _c_v = std::variant<int,
					float,
					bool,
					std::string,
					_c_vec,
					_c_map
					>;
struct _c_primitive {

	_c_v val;

	template <typename T>
	T get() {
		return std::get<T>(val);
	}

	std::string getTypeAsString() {
		std::size_t index = val.index();

		if (index == 0) {
			return std::string("float"); // According to the php and js primitives we should output float. This needs a spec.
		}else if (index == 1) {
			return std::string("float");
		}else if (index == 2) {
			return std::string("boolean");
		}else if (index == 3) {
			return std::string("string");
		}else if (index == 4) {
			return std::string("array");
		}else if (index == 5) {
			return std::string("map");
		}
	}

	_c_primitive(int x) {
		val = x;
	}

	_c_primitive(bool x) {
		val = x;
	}

	_c_primitive(std::string x) {
		val = x;
	}

	_c_primitive() {

	}

	_c_primitive(const _c_primitive& vv) {
		val = &vv.val;
	}

	~_c_primitive();
};

inline _c_primitive::~_c_primitive() = default;

#endif