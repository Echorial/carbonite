#include <string>
#include <optional>
#include <vector>
#include <map>
#include <memory>
#include <iostream>
#include <functional>
#include <variant>

#ifndef _C_NATIVE_TOOLS

#define _C_NATIVE_TOOLS

class _c_error {
	std::string message;

	_c_error(std::string msg) {
		this->message = msg;
	}
};

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


template <typename T>
typename std::enable_if<
    std::is_integral<T>::value,
	std::string
>::type _c_join(std::unique_ptr<std::vector<T>> &vec, std::string glue) {
	std::string output = "";

	for (size_t i = 0; i < vec->size(); i++) {
		output += std::to_string((*vec.get())[i]);

		if (i < vec->size() - 1)
			output += glue;
	}

	return output;
}

std::string _c_join(std::unique_ptr<std::vector<std::string>> &vec, std::string glue) {
	std::string output = "";

	for (size_t i = 0; i < vec->size(); i++) {
		output += (*vec.get())[i];

		if (i < vec->size() - 1)
			output += glue;
	}

	return output;
}

template <class T>
T _c_index_n_move(std::unique_ptr<std::vector<T>> &vec, std::size_t i) {
	return std::move((*vec.get())[i]);
}

template <class T>
T& _c_index_n(std::unique_ptr<std::vector<T>> &vec, std::size_t i) {
	return (*vec.get())[i];
}

template <class T>
T _c_index(std::unique_ptr<std::vector<_c_primitive>> &vec, std::size_t i) {
	return std::get<T>((*vec.get())[i].val);
}

template <class T>
void _c_index_n_set(std::unique_ptr<std::vector<T>> &vec, std::size_t i, T val) {
	T deleted = _c_index_n_move(vec, i);
	(*vec.get())[i] = std::move(val);
}

template <class T>
T _c_index_set(std::unique_ptr<std::vector<_c_primitive>> &vec, std::size_t i, T val) {
	(*vec.get())[i] = val;
}

template <class T>
T _c_index_map(std::unique_ptr<std::map<std::string, _c_primitive>> &vec, std::string key) {
	return std::get<T>((*vec.get())[key].val);
}

template <class T>
bool _c_map_has(std::unique_ptr<std::map<std::string, T>> &vec, std::string key) {
	auto mp = (*vec.get());
	auto val = mp.find(key);
	if (val == mp.end()) {
		return true;
	}else{
		return false;
	}
}

#endif