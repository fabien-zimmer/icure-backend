/*
 * Copyright (C) 2018 Taktik SA
 *
 * This file is part of iCureBackend.
 *
 * iCureBackend is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * iCureBackend is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with iCureBackend.  If not, see <http://www.gnu.org/licenses/>.
 */

package org.taktik.icure.be.healthdata.dto

import java.io.Serializable

class Registry(
		var id : Identifier? = null,
		var labels: Map<String,String> = mutableMapOf(),
		var description: Map<String,String> = mutableMapOf(),
		var exportConfiguration: ExportConfiguration? = null,
		var taxonomy: List<String> = mutableListOf()
) : Serializable {
	class ExportConfiguration(var format:List<String> = mutableListOf())
}


