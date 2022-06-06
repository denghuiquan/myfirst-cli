#!/usr/bin/env node

// cli的入口文件,必须要有这么一个特殊的文件头，用于指定代码文件的运行环境（hashbang注解）
// 如果是Linux或者macOS系统下的，还需要修改此文件的读写权限为755，
// 具体就是通过: chmod 755 cli.js实现修改
console.log('cli working!')
const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const ejs = require('ejs')

/**
 * 
 *  1、通过命令行交互询问用户预设的问题
 *	  使用inquirer模块实现命令行交互
 *	  yarn add inquirer
 *  2、根据用户的回答结果生成文件及其目录结构
 */
inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: 'please input your project name: ',
        default: 'MyApp'
    }
])
    .then(answers => {
        // 根据用户的回答结果生成文件及其目录结构
        // 模版目录
        const tmplDir = path.join(__dirname, '../templates')
        // 目标目录
        const destDir = process.cwd()

        // 将模板目录下的全部文件转换输出到目标目录下
        fs.readdir(tmplDir, (err, files) => {
            if (err) throw err
            files.forEach(file => {
                // 通过模版引擎去渲染模版文件
                ejs.renderFile(path.join(tmplDir, file), answers, (err, content) => {
                    if (err) throw err
                    // 把渲染结果写入到目标目录
                    try {// 写文件异常处理
                        const filePath = path.join(destDir, file)
                        fs.writeFileSync(filePath, content)
                        console.log(`created file: ${filePath}`)
                    } catch (error) {
                        throw error
                    }
                })
            })
        })
    })