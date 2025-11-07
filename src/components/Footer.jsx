import React from "react";
import { FaGithub, FaLinkedin } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 mt-20 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
        {/* Nombre chistoso y épico */}
        <h2 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
          EL CALAPZÚTIMO NOTICIERO
        </h2>

        <p className="text-lg font-bold text-gray-300">
          El único periódico que te informa mientras te saca una sonrisa
        </p>

        {/* Créditos con estilo colombiano */}
        <div className="flex flex-col items-center space-y-4 pt-6 border-t border-gray-800">
          <p className="text-sm uppercase tracking-widest text-gray-500">
            Creado con sangre, sudor y mucho café por:
          </p>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-red-600">Yamson Calapzu</span>
          </div>

          <div className="flex gap-8 mt-4">
            <a
              href="https://github.com/Calapzu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-600 transition-all duration-300 transform hover:scale-125 flex items-center gap-2"
            >
              <FaGithub className="h-6 w-6 text-gray-400 hover:text-red-600 transition-all duration-300" />
              <span className="font-bold">GitHub</span> @Calapzu
            </a>

            <a
              href="https://www.linkedin.com/in/yamson-jhoan-calapzu-palma-20a221181/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition-all duration-300 transform hover:scale-125 flex items-center gap-2"
            >
              <FaLinkedin className="h-6 w-6 text-gray-400 hover:text-blue-500 transition-all duration-300" />
              <span className="font-bold">LinkedIn</span> Yamson Calapzu
            </a>
          </div>
        </div>

        {/* Copyright con flow */}
        <p className="text-xs text-gray-500 mt-8 font-medium">
          © {new Date().getFullYear()} EL CALAPZÚTIMO NOTICIERO — Hecho en Colombia con puro amor y React
        </p>
      </div>
    </footer>
  );
}